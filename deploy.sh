#!/bin/sh

RED='\033[1;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'

NC='\033[0m' # No Color

if [[ ! $1 =~ ^(dev|prod)$ ]];
    then
    echo -e ${RED}'"'$1'"' "is not a valid deployment environment, use dev or prod${NC}";
    exit 1;
fi

echo -e "${YELLOW}Deploying back-end to $1 servers${NC}"
cd gadwick-backend && sh deployment/deploy.sh $1 && cd ..
echo -e "${GREEN}Back-end deployed to $1 ${NC}"
echo -e "${YELLOW}Deploying front-end to $1 servers${NC}"
cd gadwick-frontend && sh deployment/deploy.sh $1 && cd ..
echo -e "${GREEN}Front-end deployed to $1 ${NC}"

echo -e "${NC}Live deployments to $1 finished${NC}"