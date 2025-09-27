#!/usr/bin/env node

/**
 * SIWE API Test Script
 * 
 * This script tests the SIWE backend API endpoints without requiring a wallet.
 * It simulates the SIWE flow by creating and signing messages programmatically.
 */

const { ethers } = require('ethers');
const { SiweMessage } = require('siwe');
const fetch = require('node-fetch');

// Simple cookie jar for session management
class CookieJar {
    constructor() {
        this.cookies = new Map();
    }
    
    setCookie(cookieString, url) {
        if (!cookieString) return;
        
        const cookies = cookieString.split(',').map(c => c.trim());
        cookies.forEach(cookie => {
            const [nameValue] = cookie.split(';');
            const [name, value] = nameValue.split('=');
            if (name && value) {
                this.cookies.set(name.trim(), value.trim());
            }
        });
    }
    
    getCookieString() {
        return Array.from(this.cookies.entries())
            .map(([name, value]) => `${name}=${value}`)
            .join('; ');
    }
}

const cookieJar = new CookieJar();

// Configuration
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';
const TEST_WALLET_PRIVATE_KEY = process.env.TEST_WALLET_PRIVATE_KEY || ethers.Wallet.createRandom().privateKey;

// Colors for console output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
};

// Helper functions
function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(message) {
    log(`✅ ${message}`, 'green');
}

function logError(message) {
    log(`❌ ${message}`, 'red');
}

function logInfo(message) {
    log(`ℹ️  ${message}`, 'blue');
}

function logWarning(message) {
    log(`⚠️  ${message}`, 'yellow');
}

// Test functions
async function testHealthEndpoint() {
    logInfo('Testing health endpoint...');
    try {
        const response = await fetch(`${BACKEND_URL}/health`);
        const data = await response.json();
        
        if (response.ok) {
            logSuccess(`Health check passed: ${data.status}`);
            return true;
        } else {
            logError(`Health check failed: ${data.message}`);
            return false;
        }
    } catch (error) {
        logError(`Health check error: ${error.message}`);
        return false;
    }
}

async function testNonceEndpoint() {
    logInfo('Testing nonce endpoint...');
    try {
        const response = await fetch(`${BACKEND_URL}/auth/nonce`, {
            headers: {
                'Cookie': cookieJar.getCookieString()
            }
        });
        
        // Store cookies from response
        const setCookieHeader = response.headers.get('set-cookie');
        if (setCookieHeader) {
            cookieJar.setCookie(setCookieHeader);
        }
        
        const data = await response.json();
        
        if (response.ok) {
            logSuccess(`Nonce generated: ${data.nonce}`);
            return data.nonce;
        } else {
            logError(`Nonce generation failed: ${data.message}`);
            return null;
        }
    } catch (error) {
        logError(`Nonce generation error: ${error.message}`);
        return null;
    }
}

async function testAuthMeEndpoint() {
    logInfo('Testing /auth/me endpoint (should fail without auth)...');
    try {
        const response = await fetch(`${BACKEND_URL}/auth/me`);
        const data = await response.json();
        
        if (response.status === 401) {
            logSuccess('Correctly returned 401 for unauthenticated request');
            return true;
        } else {
            logWarning(`Unexpected response: ${response.status} - ${JSON.stringify(data)}`);
            return false;
        }
    } catch (error) {
        logError(`Auth me test error: ${error.message}`);
        return false;
    }
}

async function testProtectedEndpoint() {
    logInfo('Testing protected endpoint (should fail without auth)...');
    try {
        const response = await fetch(`${BACKEND_URL}/protected`);
        const data = await response.json();
        
        if (response.status === 401) {
            logSuccess('Correctly returned 401 for unauthenticated protected route');
            return true;
        } else {
            logWarning(`Unexpected response: ${response.status} - ${JSON.stringify(data)}`);
            return false;
        }
    } catch (error) {
        logError(`Protected endpoint test error: ${error.message}`);
        return false;
    }
}

async function testSIWEFlow() {
    logInfo('Testing complete SIWE authentication flow...');
    
    try {
        // Create a test wallet
        const wallet = new ethers.Wallet(TEST_WALLET_PRIVATE_KEY);
        const address = wallet.address;
        
        logInfo(`Using test wallet: ${address}`);
        
        // Step 1: Get nonce
        const nonce = await testNonceEndpoint();
        if (!nonce) {
            return false;
        }
        
        // Step 2: Create SIWE message
        const domain = 'localhost';
        const uri = 'http://localhost:3001';
        const chainId = 1; // Mainnet for testing
        
        const siweMessage = new SiweMessage({
            domain,
            address,
            statement: 'Sign in with Ethereum to the app.',
            uri,
            version: '1',
            chainId,
            nonce
        });
        
        const messageToSign = siweMessage.prepareMessage();
        logInfo(`Message to sign: ${messageToSign}`);
        
        // Step 3: Sign the message
        const signature = await wallet.signMessage(messageToSign);
        logInfo(`Signature: ${signature}`);
        
        // Step 4: Verify with backend
        logInfo('Sending verification request...');
        const response = await fetch(`${BACKEND_URL}/auth/verify`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookieJar.getCookieString()
            },
            body: JSON.stringify({
                message: messageToSign,
                signature: signature
            })
        });
        
        // Store cookies from response
        const setCookieHeader = response.headers.get('set-cookie');
        if (setCookieHeader) {
            cookieJar.setCookie(setCookieHeader);
        }
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            logSuccess('SIWE authentication successful!');
            logInfo(`User data: ${JSON.stringify(data.user, null, 2)}`);
            return true;
        } else {
            logError(`SIWE authentication failed: ${data.message}`);
            return false;
        }
        
    } catch (error) {
        logError(`SIWE flow error: ${error.message}`);
        return false;
    }
}

async function testAuthenticatedEndpoints() {
    logInfo('Testing authenticated endpoints...');
    
    try {
        // First authenticate
        const wallet = new ethers.Wallet(TEST_WALLET_PRIVATE_KEY);
        const address = wallet.address;
        
        // Get nonce and authenticate
        const nonceResponse = await fetch(`${BACKEND_URL}/auth/nonce`, {
            headers: {
                'Cookie': cookieJar.getCookieString()
            }
        });
        
        // Store cookies from response
        const nonceSetCookieHeader = nonceResponse.headers.get('set-cookie');
        if (nonceSetCookieHeader) {
            cookieJar.setCookie(nonceSetCookieHeader);
        }
        
        const nonceData = await nonceResponse.json();
        
        if (!nonceResponse.ok) {
            logError('Failed to get nonce for authenticated test');
            return false;
        }
        
        const siweMessage = new SiweMessage({
            domain: 'localhost',
            address,
            statement: 'Sign in with Ethereum to the app.',
            uri: 'http://localhost:3001',
            version: '1',
            chainId: 1,
            nonce: nonceData.nonce
        });
        
        const messageToSign = siweMessage.prepareMessage();
        const signature = await wallet.signMessage(messageToSign);
        
        // Authenticate
        const authResponse = await fetch(`${BACKEND_URL}/auth/verify`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookieJar.getCookieString()
            },
            body: JSON.stringify({
                message: messageToSign,
                signature: signature
            })
        });
        
        // Store cookies from response
        const authSetCookieHeader = authResponse.headers.get('set-cookie');
        if (authSetCookieHeader) {
            cookieJar.setCookie(authSetCookieHeader);
        }
        
        if (!authResponse.ok) {
            logError('Authentication failed for authenticated endpoint test');
            return false;
        }
        
        if (!authSetCookieHeader) {
            logWarning('No session cookie received - this might cause issues with session-based auth');
        }
        
        // Test /auth/me with session
        const meResponse = await fetch(`${BACKEND_URL}/auth/me`, {
            headers: {
                'Cookie': cookieJar.getCookieString()
            }
        });
        
        const meData = await meResponse.json();
        
        if (meResponse.ok && meData.authenticated) {
            logSuccess('Authenticated /auth/me endpoint works');
        } else {
            logError(`Authenticated /auth/me failed: ${JSON.stringify(meData)}`);
        }
        
        // Test protected route with session
        const protectedResponse = await fetch(`${BACKEND_URL}/protected`, {
            headers: {
                'Cookie': cookieJar.getCookieString()
            }
        });
        
        const protectedData = await protectedResponse.json();
        
        if (protectedResponse.ok) {
            logSuccess('Protected route works with authentication');
        } else {
            logError(`Protected route failed: ${JSON.stringify(protectedData)}`);
        }
        
        return true;
        
    } catch (error) {
        logError(`Authenticated endpoints test error: ${error.message}`);
        return false;
    }
}

// Main test runner
async function runTests() {
    log('\n🚀 Starting SIWE API Tests', 'bright');
    log(`Backend URL: ${BACKEND_URL}`, 'cyan');
    log(`Test Wallet: ${new ethers.Wallet(TEST_WALLET_PRIVATE_KEY).address}`, 'cyan');
    log('', 'reset');
    
    const tests = [
        { name: 'Health Endpoint', fn: testHealthEndpoint },
        { name: 'Nonce Endpoint', fn: testNonceEndpoint },
        { name: 'Auth Me (Unauthenticated)', fn: testAuthMeEndpoint },
        { name: 'Protected Route (Unauthenticated)', fn: testProtectedEndpoint },
        { name: 'SIWE Authentication Flow', fn: testSIWEFlow },
        { name: 'Authenticated Endpoints', fn: testAuthenticatedEndpoints }
    ];
    
    let passed = 0;
    let total = tests.length;
    
    for (const test of tests) {
        log(`\n--- ${test.name} ---`, 'magenta');
        try {
            const result = await test.fn();
            if (result) {
                passed++;
            }
        } catch (error) {
            logError(`Test ${test.name} threw an error: ${error.message}`);
        }
    }
    
    log('\n📊 Test Results', 'bright');
    log(`Passed: ${passed}/${total}`, passed === total ? 'green' : 'yellow');
    
    if (passed === total) {
        logSuccess('All tests passed! 🎉');
    } else {
        logWarning('Some tests failed. Check the output above for details.');
    }
    
    log('\n💡 Tips:', 'cyan');
    log('1. Make sure your backend server is running on the correct port');
    log('2. Check that all dependencies are installed (npm install)');
    log('3. Verify your .env file has the correct configuration');
    log('4. For browser testing, open test-client.html in your browser');
}

// Handle command line arguments
if (process.argv.includes('--help') || process.argv.includes('-h')) {
    log('SIWE API Test Script', 'bright');
    log('');
    log('Usage: node test-api.js [options]');
    log('');
    log('Options:');
    log('  --help, -h     Show this help message');
    log('  --url <url>    Set backend URL (default: http://localhost:3001)');
    log('  --key <key>    Set test wallet private key');
    log('');
    log('Environment Variables:');
    log('  BACKEND_URL              Backend server URL');
    log('  TEST_WALLET_PRIVATE_KEY  Private key for test wallet');
    log('');
    process.exit(0);
}

// Parse command line arguments
const urlIndex = process.argv.indexOf('--url');
if (urlIndex !== -1 && process.argv[urlIndex + 1]) {
    process.env.BACKEND_URL = process.argv[urlIndex + 1];
}

const keyIndex = process.argv.indexOf('--key');
if (keyIndex !== -1 && process.argv[keyIndex + 1]) {
    process.env.TEST_WALLET_PRIVATE_KEY = process.argv[keyIndex + 1];
}

// Run tests
runTests().catch(error => {
    logError(`Test runner failed: ${error.message}`);
    process.exit(1);
});
