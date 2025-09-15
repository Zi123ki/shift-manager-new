#!/bin/bash

# 🏠 Shift Manager - Local Development Setup Script
# סקריפט הכנה לפיתוח מקומי

set -e  # Exit on any error

echo "🏠 Shift Manager - Local Development Setup"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'.' -f1 | cut -d'v' -f2)
if [ "$NODE_VERSION" -lt 20 ]; then
    echo -e "${RED}❌ Node.js version 20+ required${NC}"
    echo "Current version: $(node --version)"
    echo "Please upgrade Node.js"
    exit 1
fi

echo -e "${GREEN}✅ Node.js $(node --version) found${NC}"

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo -e "${YELLOW}⚠️  Installing wrangler CLI...${NC}"
    npm install -g wrangler
fi

echo -e "${GREEN}✅ wrangler CLI ready${NC}"

# Install dependencies
echo -e "${BLUE}📦 Installing dependencies...${NC}"
npm install

echo -e "${GREEN}✅ Dependencies installed${NC}"

# Setup local D1 database
echo -e "${BLUE}🗄️  Setting up local database...${NC}"

# Create local D1 database if not exists
if ! wrangler d1 list | grep -q "shift_manager_db"; then
    echo "Creating local D1 database..."
    wrangler d1 create shift_manager_db

    # Get database ID and update wrangler.toml
    echo -e "${YELLOW}⚠️  Please update wrangler.toml with the database_id from above${NC}"
else
    echo -e "${GREEN}✅ Local database already exists${NC}"
fi

# Run migrations
echo -e "${BLUE}🔄 Running database migrations...${NC}"
wrangler d1 migrations apply shift_manager_db --local

echo -e "${GREEN}✅ Database migrations completed${NC}"

# Run seed data
echo -e "${BLUE}🌱 Adding seed data...${NC}"
npm run db:seed

echo -e "${GREEN}✅ Seed data added${NC}"

# Create .env.local file if not exists
if [ ! -f "apps/web/.env.local" ]; then
    echo -e "${BLUE}📝 Creating local environment file...${NC}"
    mkdir -p apps/web
    cat > apps/web/.env.local << EOF
# Local development environment
NODE_ENV=development
VITE_API_URL=http://localhost:8787
EOF
    echo -e "${GREEN}✅ .env.local created${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Local setup completed!${NC}"
echo ""
echo -e "${BLUE}To start development:${NC}"
echo ""
echo -e "${YELLOW}Terminal 1 (Frontend):${NC}"
echo "npm run dev"
echo ""
echo -e "${YELLOW}Terminal 2 (API):${NC}"
echo "npm run dev:api"
echo ""
echo -e "${GREEN}🔐 Admin login:${NC}"
echo "Username: zvika"
echo "Password: Zz321321"
echo ""
echo -e "${BLUE}URLs:${NC}"
echo "Frontend: http://localhost:3000"
echo "API: http://localhost:8787"
echo ""
echo -e "${GREEN}Happy coding! 🚀${NC}"