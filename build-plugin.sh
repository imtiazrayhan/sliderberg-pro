#!/bin/bash

# Exit on error
set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}Building Sliderberg Pro...${NC}"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo -e "${BLUE}Installing dependencies...${NC}"
    npm install
fi

# Build the plugin
echo -e "${BLUE}Building assets...${NC}"
npm run build

# Create build directory if it doesn't exist
if [ ! -d "build" ]; then
    mkdir build
fi

# Create zip file
echo -e "${BLUE}Creating plugin zip...${NC}"
zip -r sliderberg-pro-1.0.0.zip \
    sliderberg-pro.php \
    includes \
    build \
    languages \
    -x "*.DS_Store" \
    -x "*.git*" \
    -x "node_modules/*" \
    -x "src/*"

echo -e "${GREEN}Build complete! Plugin zip created: sliderberg-pro-1.0.0.zip${NC}" 