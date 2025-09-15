#!/bin/bash

# 🔍 Shift Manager - Deployment Verification Script
# סקריפט בדיקת פריסה

set -e

echo "🔍 Shift Manager - Deployment Verification"
echo "========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get URL from user
echo -e "${BLUE}Enter your Cloudflare Pages URL:${NC}"
echo "Example: https://shift-manager.pages.dev"
read -p "URL: " SITE_URL

if [ -z "$SITE_URL" ]; then
    echo -e "${RED}❌ URL is required${NC}"
    exit 1
fi

echo -e "${BLUE}🌐 Testing deployment at: $SITE_URL${NC}"
echo ""

# Function to check HTTP status
check_endpoint() {
    local url=$1
    local description=$2
    local expected_status=${3:-200}

    echo -n "Testing $description... "

    response=$(curl -s -o /dev/null -w "%{http_code}" "$url" || echo "000")

    if [ "$response" -eq "$expected_status" ]; then
        echo -e "${GREEN}✅ OK ($response)${NC}"
        return 0
    else
        echo -e "${RED}❌ Failed ($response)${NC}"
        return 1
    fi
}

# Test main endpoints
echo -e "${YELLOW}📊 Testing Frontend:${NC}"
check_endpoint "$SITE_URL" "Homepage"
check_endpoint "$SITE_URL/login" "Login page" 200

echo ""
echo -e "${YELLOW}🔧 Testing API Endpoints:${NC}"
check_endpoint "$SITE_URL/api/health" "Health check"
check_endpoint "$SITE_URL/api/auth/me" "Auth endpoint" 401  # Should return 401 (unauthorized)

echo ""
echo -e "${YELLOW}📱 Testing Mobile Responsiveness:${NC}"

# Test with different user agents
echo -n "Testing mobile user agent... "
mobile_response=$(curl -s -o /dev/null -w "%{http_code}" -H "User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15" "$SITE_URL" || echo "000")

if [ "$mobile_response" -eq "200" ]; then
    echo -e "${GREEN}✅ Mobile OK${NC}"
else
    echo -e "${RED}❌ Mobile Failed ($mobile_response)${NC}"
fi

echo ""
echo -e "${YELLOW}🔍 Testing Page Content:${NC}"

# Check if login page contains expected elements
echo -n "Checking login form... "
login_content=$(curl -s "$SITE_URL/login" || echo "")

if echo "$login_content" | grep -q "username\|password\|login"; then
    echo -e "${GREEN}✅ Login form found${NC}"
else
    echo -e "${RED}❌ Login form not found${NC}"
fi

# Check for Hebrew support
echo -n "Checking Hebrew support... "
if echo "$login_content" | grep -q "התחבר\|התחברות"; then
    echo -e "${GREEN}✅ Hebrew text found${NC}"
else
    echo -e "${YELLOW}⚠️  Hebrew text not detected${NC}"
fi

# Check meta tags for mobile
echo -n "Checking mobile meta tags... "
homepage_content=$(curl -s "$SITE_URL" || echo "")

if echo "$homepage_content" | grep -q "viewport.*width=device-width"; then
    echo -e "${GREEN}✅ Mobile viewport found${NC}"
else
    echo -e "${RED}❌ Mobile viewport missing${NC}"
fi

echo ""
echo -e "${BLUE}🎯 Manual Testing Checklist:${NC}"
echo ""
echo "Please manually verify the following:"
echo "□ Open $SITE_URL in browser"
echo "□ Login with: zvika / Zz321321"
echo "□ Test mobile view (F12 → Device toolbar)"
echo "□ Check Hebrew/English language switch"
echo "□ Test hamburger menu on mobile"
echo "□ Verify dashboard displays correctly"
echo "□ Test all navigation links"
echo ""
echo -e "${GREEN}🔐 Admin Credentials:${NC}"
echo "Username: zvika"
echo "Password: Zz321321"
echo -e "${YELLOW}⚠️  Change password immediately after first login!${NC}"
echo ""
echo -e "${BLUE}📊 Performance Testing:${NC}"
echo "Test with GTmetrix: https://gtmetrix.com/"
echo "Test with PageSpeed Insights: https://pagespeed.web.dev/"
echo ""

# Final status
echo -e "${GREEN}✅ Basic deployment verification completed${NC}"
echo -e "${BLUE}🚀 Your Shift Manager is ready for use!${NC}"