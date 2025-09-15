#!/bin/bash

# 🚀 Shift Manager - Production Deployment Script
# מסקריפט פריסה אוטומטי לפרודקשן

set -e  # Exit on any error

echo "🚀 Shift Manager - Production Deployment"
echo "========================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo -e "${RED}❌ wrangler CLI is not installed${NC}"
    echo "Install it with: npm install -g wrangler"
    exit 1
fi

echo -e "${GREEN}✅ wrangler CLI found${NC}"

# Check if logged in to Cloudflare
if ! wrangler whoami &> /dev/null; then
    echo -e "${YELLOW}⚠️  Not logged in to Cloudflare${NC}"
    echo "Please run: wrangler auth login"
    exit 1
fi

echo -e "${GREEN}✅ Cloudflare authentication verified${NC}"

# Step 1: Create D1 Database (if not exists)
echo -e "${BLUE}📊 Creating D1 Database...${NC}"

# Check if database already exists in wrangler.toml
DB_ID=$(grep -o 'database_id = "[^"]*"' wrangler.toml | cut -d'"' -f2)

if [ -z "$DB_ID" ] || [ "$DB_ID" = "" ]; then
    echo "Creating new D1 database..."

    # Create database and capture output
    OUTPUT=$(wrangler d1 create shift_manager_db 2>&1)

    # Extract database ID from output
    NEW_DB_ID=$(echo "$OUTPUT" | grep -o '[a-f0-9-]\{36\}' | head -1)

    if [ -n "$NEW_DB_ID" ]; then
        # Update wrangler.toml with the new database ID
        sed -i.bak "s/database_id = \"\"/database_id = \"$NEW_DB_ID\"/" wrangler.toml
        echo -e "${GREEN}✅ Database created with ID: $NEW_DB_ID${NC}"
        echo -e "${GREEN}✅ wrangler.toml updated${NC}"
    else
        echo -e "${RED}❌ Failed to create database${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✅ Database ID already configured: $DB_ID${NC}"
fi

# Step 2: Run migrations
echo -e "${BLUE}🗄️  Running database migrations...${NC}"
wrangler d1 migrations apply shift_manager_db --remote

echo -e "${GREEN}✅ Database migrations completed${NC}"

# Step 3: Build the project
echo -e "${BLUE}🔨 Building project...${NC}"
npm install
npm run build

echo -e "${GREEN}✅ Project built successfully${NC}"

# Step 4: Git operations
echo -e "${BLUE}📝 Preparing Git commit...${NC}"

# Add all files
git add .

# Commit with timestamp
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")
git commit -m "🚀 Production deployment - $TIMESTAMP

✅ Mobile responsive updates
📱 Touch-friendly UI
🔧 Clean login screen
🌍 RTL Hebrew support
🏢 Multi-tenant ready"

echo -e "${GREEN}✅ Git commit created${NC}"

# Step 5: Push to GitHub (if remote exists)
if git remote get-url origin &> /dev/null; then
    echo -e "${BLUE}📤 Pushing to GitHub...${NC}"
    git push origin main
    echo -e "${GREEN}✅ Code pushed to GitHub${NC}"
else
    echo -e "${YELLOW}⚠️  No Git remote configured${NC}"
    echo "Add your GitHub remote with:"
    echo "git remote add origin https://github.com/YOUR-USERNAME/shift-manager.git"
fi

# Step 6: Deploy to Pages (if pages project exists)
echo -e "${BLUE}🌐 Deploying to Cloudflare Pages...${NC}"
wrangler pages deploy apps/web/dist --project-name=shift-manager || {
    echo -e "${YELLOW}⚠️  Pages project 'shift-manager' not found${NC}"
    echo "Create it first in the Cloudflare dashboard"
}

echo ""
echo -e "${GREEN}🎉 Deployment completed!${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "1. Go to Cloudflare Pages dashboard"
echo "2. Configure environment variables:"
echo "   - SESSION_SECRET=your-secure-secret-key"
echo "   - NODE_ENV=production"
echo "3. Add D1 database binding:"
echo "   - Variable: DB"
echo "   - Database: shift_manager_db"
echo "4. Test your deployment"
echo ""
echo -e "${GREEN}🔐 Admin login: zvika / Zz321321${NC}"
echo -e "${YELLOW}⚠️  Change default password immediately!${NC}"