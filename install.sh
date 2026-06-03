#!/bin/bash

# ChatterBox Installation Script
# This script automates the installation process

echo "🚀 ChatterBox Installation Script"
echo "==================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v16+"
    echo "Visit: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    exit 1
fi

echo "✅ npm version: $(npm --version)"
echo ""

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git"
    echo "Visit: https://git-scm.com/"
    exit 1
fi

echo "✅ Git version: $(git --version)"
echo ""

# Check if Expo CLI is installed
if ! command -v expo &> /dev/null; then
    echo "📦 Installing Expo CLI..."
    npm install -g expo-cli
fi

echo "✅ Expo CLI installed"
echo ""

# Install dependencies
echo "📦 Installing project dependencies..."
echo "This may take a few minutes..."
echo ""

npm install

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Dependencies installed successfully!"
else
    echo ""
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo ""
echo "==================================="
echo "✅ Installation Complete!"
echo "==================================="
echo ""
echo "📝 Next steps:"
echo "1. Edit .env file with your API endpoints"
echo "2. Run: npm start"
echo "3. Scan QR code with Expo Go app"
echo ""
echo "For more info, see INSTALLATION.md"
echo ""
