#!/bin/bash

# BeeTrack Railway Deployment Script
# This script automates the entire Railway deployment process

set -e

echo "🚂 BeeTrack Railway Deployment Script"
echo "======================================="
echo ""

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "📦 Installing Railway CLI..."
    npm install -g @railway/cli
    echo "✅ Railway CLI installed"
else
    echo "✅ Railway CLI already installed"
fi

echo ""
echo "🔐 Please login to Railway..."
railway login

echo ""
echo "📁 Initializing Railway project..."
railway init

echo ""
echo "🗄️ Adding PostgreSQL database..."
railway add --database postgresql

echo ""
echo "🗄️ Adding Redis..."
railway add --database redis

echo ""
echo "⚙️ Setting environment variables..."
railway variables set NODE_ENV=production
railway variables set PORT=3000

echo ""
echo "🚀 Deploying BeeTrack backend..."
cd backend
railway up
cd ..

echo ""
echo "🎨 Deploying BeeTrack frontend..."
cd frontend
railway up
cd ..

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📝 Next steps:"
echo "1. Get your backend URL: railway open"
echo "2. Update frontend VITE_API_URL with backend URL"
echo "3. Add Twilio/Slack credentials in Railway dashboard (optional)"
echo ""
echo "🎉 Your BeeTrack app is now live on Railway!"
