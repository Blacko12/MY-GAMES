#!/bin/bash

# ChatterBox Quick Start Script

echo "🚀 ChatterBox Quick Start"
echo "========================="
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

echo ""
echo "Starting ChatterBox..."
echo ""
echo "Choose how to run:"
echo "1) Web Preview (http://localhost:19006)"
echo "2) Android Emulator"
echo "3) iOS Simulator (Mac only)"
echo "4) Expo App (scan QR code)"
echo ""

read -p "Select option (1-4): " choice

case $choice in
    1)
        echo "Starting web preview..."
        npm run web
        ;;
    2)
        echo "Starting Android emulator..."
        npm run android
        ;;
    3)
        echo "Starting iOS simulator..."
        npm run ios
        ;;
    4)
        echo "Starting Expo..."
        npm start
        ;;
    *)
        echo "Invalid option"
        exit 1
        ;;
esac
