const express = require('express');
const cors = require('cors');
const session = require('express-session');
const { SiweMessage } = require('siwe');
const { ethers } = require('ethers');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'];
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: 'lax',
  }
}));

// Helper function to generate random nonce
function generateNonce() {
  return ethers.hexlify(ethers.randomBytes(32));
}

// Routes

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Get nonce for SIWE
app.get('/auth/nonce', (req, res) => {
  try {
    const nonce = generateNonce();
    req.session.nonce = nonce;
    
    res.json({ 
      nonce,
      message: 'Nonce generated successfully'
    });
  } catch (error) {
    console.error('Error generating nonce:', error);
    res.status(500).json({ 
      error: 'Failed to generate nonce',
      message: error.message 
    });
  }
});

// Verify SIWE message and authenticate user
app.post('/auth/verify', async (req, res) => {
  try {
    const { message, signature, nonce } = req.body;

    if (!message || !signature) {
      return res.status(400).json({ 
        error: 'Missing required parameters',
        message: 'Both message and signature are required'
      });
    }

    // Parse the SIWE message
    const siweMessage = new SiweMessage(message);
    
    // Verify the message has the correct nonce
    if (!nonce || siweMessage.nonce !== nonce) {
      return res.status(400).json({ 
        error: 'Invalid nonce',
        message: 'Nonce mismatch or missing session nonce'
      });
    }

    // Verify the signature
    const verificationResult = await siweMessage.verify({ signature });

    if (verificationResult.success) {
      // Store user session data
      req.session.user = {
        address: siweMessage.address,
        chainId: siweMessage.chainId,
        domain: siweMessage.domain,
        uri: siweMessage.uri,
        version: siweMessage.version,
        authenticatedAt: new Date().toISOString()
      };

      // Clear the nonce after successful verification
      req.session.nonce = null;

      res.json({
        success: true,
        message: 'Authentication successful',
        user: req.session.user
      });
    } else {
      res.status(401).json({
        error: 'Authentication failed',
        message: 'Invalid signature or message verification failed'
      });
    }
  } catch (error) {
    console.error('Error during SIWE verification:', error);
    res.status(500).json({
      error: 'Verification failed',
      message: error.message
    });
  }
});

// Get current user session
app.get('/auth/me', (req, res) => {
  if (req.session.user) {
    res.json({
      authenticated: true,
      user: req.session.user
    });
  } else {
    res.status(401).json({
      authenticated: false,
      message: 'Not authenticated'
    });
  }
});

// Logout endpoint
app.post('/auth/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
      return res.status(500).json({
        error: 'Logout failed',
        message: 'Could not destroy session'
      });
    }

    res.clearCookie('connect.sid');
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  });
});

// Authentication middleware for protected routes
const requireAuth = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.status(401).json({
      error: 'Authentication required',
      message: 'Please authenticate with SIWE first'
    });
  }
};

// Protected route example
app.get('/protected', requireAuth, (req, res) => {
  res.json({
    message: 'This is a protected route',
    user: req.session.user,
    accessTime: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: `Route ${req.originalUrl} not found`
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 SIWE Backend server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 CORS origins: ${process.env.ALLOWED_ORIGINS || 'http://localhost:3000'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});

module.exports = app;