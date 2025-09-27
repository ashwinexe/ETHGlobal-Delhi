#!/bin/bash

# SIWE Environment Setup Script

echo "🔧 Setting up SIWE testing environment..."

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cat > .env << EOF
# SIWE Backend Configuration
NODE_ENV=development
PORT=3001
SESSION_SECRET=$(openssl rand -hex 32)

# CORS Configuration
# Comma-separated list of allowed origins
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001,http://127.0.0.1:3000,http://127.0.0.1:3001

# Optional: Add your domain for production
# DOMAIN=yourdomain.com
EOF
    echo "✅ .env file created with random session secret"
else
    echo "⚠️  .env file already exists, skipping creation"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Start the server: npm start"
echo "2. Open test-client.html in your browser for interactive testing"
echo "3. Run automated tests: npm test"
echo "4. View testing guide: cat TESTING.md"
