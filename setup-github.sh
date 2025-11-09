#!/bin/bash

# GitHub Repository Setup Script for Auction Platform Design Files
# Run this script to create a GitHub repo with design files

echo "🚀 Setting up GitHub repository for design files..."
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Create design-only directory
echo -e "${BLUE}Step 1: Creating design files directory...${NC}"
cd /KRYPTO/Lab
mkdir -p auction-design
cd auction-design

# Copy design files
cp -r ../Bid/app ./
cp -r ../Bid/components ./
cp -r ../Bid/public ./
cp ../Bid/tailwind.config.* ./ 2>/dev/null || true
cp ../Bid/package.json ./
cp ../Bid/tsconfig.json ./

# Copy documentation from design package
unzip -q ../Bid/Bid-Design-Package.zip
cp Bid-Design/*.md ./
rm -rf Bid-Design

echo -e "${GREEN}✓ Design files copied${NC}"

# Step 2: Create .gitignore
echo -e "${BLUE}Step 2: Creating .gitignore...${NC}"
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
.pnpm-store/

# Build outputs
.next/
out/
dist/
build/

# Environment variables
.env
.env.local
.env.production.local
.env.development.local

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Testing
coverage/
.nyc_output/

# Misc
.turbo/
.vercel/
EOF

echo -e "${GREEN}✓ .gitignore created${NC}"

# Step 3: Create README for GitHub
echo -e "${BLUE}Step 3: Creating GitHub README...${NC}"
cat > README.md << 'EOF'
# 🎨 Auction Platform - Design Files

Design files for the watch.ws auction platform. This repository contains all UI components and pages for design enhancement.

## 📋 Quick Start

1. **Read Documentation First**
   - Start with `QUICK-START.md`
   - Then read `DESIGNER-INSTRUCTIONS.md`

2. **Install Dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Start Designing**
   - Edit component files in `components/`
   - Update styles in `app/globals.css`
   - Modify Tailwind config if needed

## 📁 Structure

```
├── app/                    # Page components
│   ├── page.tsx           # Homepage
│   ├── [id]/              # Item detail page
│   ├── create/            # Create listing
│   └── auth/              # Authentication pages
├── components/             # UI components
│   ├── item-card.tsx      # Item preview cards
│   ├── live-item-view.tsx # Item detail view
│   ├── bid-form.tsx       # Bidding interface
│   └── ui/                # Base components
├── public/                 # Static assets
└── *.md                   # Documentation
```

## 🎯 Priority Areas

1. **Homepage** - Item grid layout
2. **Item Detail** - Gallery and bid section
3. **Bid Form** - Make bidding exciting
4. **Mobile** - Perfect responsive design

## ✅ What You Can Change

- ✅ Colors and themes
- ✅ Typography and fonts
- ✅ Layouts and spacing
- ✅ Animations and transitions
- ✅ Images and icons

## ❌ What You Cannot Change

- ❌ Component names and props
- ❌ Event handlers and logic
- ❌ API calls and data fetching
- ❌ Form field names

## 📱 Test Breakpoints

- Mobile: 375px, 414px
- Tablet: 768px
- Laptop: 1024px
- Desktop: 1440px+

## 🛠️ Tech Stack

- Next.js 16 (React)
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Lucide React icons

## 📖 Documentation

- `QUICK-START.md` - Fast onboarding guide
- `DESIGNER-INSTRUCTIONS.md` - Complete guidelines
- `CURRENT-DESIGN.md` - Current design analysis
- `FILE-STRUCTURE.md` - File organization
- `COMPONENT-REFERENCE.md` - Component details

## 🚀 Submitting Changes

1. Make your design changes
2. Test on all breakpoints
3. Commit your changes
4. Push to your branch
5. Create a pull request

## 📞 Questions?

If you need clarification or want to make structural changes, please open an issue.

---

**Happy designing! 🎨✨**
EOF

echo -e "${GREEN}✓ README.md created${NC}"

# Step 4: Initialize Git
echo -e "${BLUE}Step 4: Initializing Git repository...${NC}"
git init
git add .
git commit -m "Initial commit: Design files for auction platform

- Added all page components (app/)
- Added all UI components (components/)
- Added documentation files
- Added Tailwind config
- Ready for design enhancement"

echo -e "${GREEN}✓ Git repository initialized${NC}"

# Step 5: Instructions for GitHub
echo ""
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✓ Repository prepared successfully!${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${BLUE}📋 Next Steps:${NC}"
echo ""
echo "1. Create a new repository on GitHub:"
echo "   → Go to https://github.com/new"
echo "   → Repository name: auction-platform-design"
echo "   → Description: Design files for auction platform"
echo "   → Make it Public or Private"
echo "   → DON'T initialize with README (we already have one)"
echo "   → Click 'Create repository'"
echo ""
echo "2. Push to GitHub (replace YOUR_USERNAME):"
echo -e "${GREEN}"
echo "   git remote add origin https://github.com/YOUR_USERNAME/auction-platform-design.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo -e "${NC}"
echo "3. Share the repository URL with your designer:"
echo "   https://github.com/YOUR_USERNAME/auction-platform-design"
echo ""
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${BLUE}Repository location:${NC} /KRYPTO/Lab/auction-design"
echo ""
EOF

chmod +x setup-github.sh

echo "✓ Script created"
