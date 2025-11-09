#!/bin/bash

# Auction Platform Installation Script
# This script automates the setup process

set -e

echo "🚀 Auction Platform Installation"
echo "================================"
echo ""

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm is not installed. Please install it first:"
    echo "   npm install -g pnpm"
    exit 1
fi

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL is not installed."
    echo "   Ubuntu/Debian: sudo apt install postgresql postgresql-contrib"
    echo "   macOS: brew install postgresql"
    exit 1
fi

echo "✅ Prerequisites check passed"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install
echo "✅ Dependencies installed"
echo ""

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp env.example .env
    
    # Generate NEXTAUTH_SECRET
    SECRET=$(openssl rand -base64 32)
    
    # Update .env file
    sed -i "s|your-secret-key-change-this-in-production|$SECRET|g" .env
    
    echo "✅ .env file created"
    echo ""
    echo "⚠️  IMPORTANT: Please update the DATABASE_URL in .env file with your PostgreSQL credentials"
    echo "   Current: postgresql://postgres:postgres@localhost:5432/auction_db?schema=public"
    echo ""
    read -p "Press Enter after updating .env file..."
else
    echo "✅ .env file already exists"
fi

# Create uploads directory
echo "📁 Creating uploads directory..."
mkdir -p public/uploads
echo "✅ Uploads directory created"
echo ""

# Generate Prisma Client
echo "🔧 Generating Prisma Client..."
pnpm db:generate
echo "✅ Prisma Client generated"
echo ""

# Push schema to database
echo "🗄️  Pushing schema to database..."
echo "   Make sure PostgreSQL is running and the database exists"
pnpm db:push || {
    echo ""
    echo "❌ Failed to push schema to database"
    echo "   Please ensure:"
    echo "   1. PostgreSQL is running"
    echo "   2. Database 'auction_db' exists"
    echo "   3. DATABASE_URL in .env is correct"
    echo ""
    echo "   To create the database, run:"
    echo "   sudo -u postgres psql"
    echo "   CREATE DATABASE auction_db;"
    echo "   \\q"
    exit 1
}
echo "✅ Schema pushed to database"
echo ""

echo "🎉 Installation complete!"
echo ""
echo "To start the development server:"
echo "   pnpm dev"
echo ""
echo "The application will be available at:"
echo "   http://localhost:3000"
echo ""
echo "📚 For more information, see:"
echo "   - README.md - Full documentation"
echo "   - SETUP.md - Quick setup guide"
echo "   - CHANGES.md - List of changes made"
echo ""
