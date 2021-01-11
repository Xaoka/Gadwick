#!/bin/sh

RED='\033[1;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'

NC='\033[0m' # No Color

echo -e "${YELLOW}Deploying back-end to live servers${NC}"
cd gadwick-backend && sls deploy && cd ..
echo -e "${GREEN}Back-end deployed${NC}"
echo -e "${YELLOW}Deploying front-end to live servers${NC}"
cd gadwick-frontend && sls deploy && cd ..
echo -e "${GREEN}Front-end deployed${NC}"

echo -e "${NC}Live deployments finished${NC}"