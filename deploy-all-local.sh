#!/bin/bash
set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}=== ATK Full Local Deployment ===${NC}\n"

run_step() {
  local label="$1"
  local script="$2"

  echo -e "${YELLOW}>> ${label}${NC}"

  if [ ! -f "$script" ]; then
    echo -e "${RED}Error: $script not found${NC}"
    exit 1
  fi

  bash "$script"
  echo -e "${GREEN}OK: ${label}${NC}\n"
}

# Required order:
# deploy-db-local -> deploy-api-local -> deploy-admin-local -> deploy-web-local
run_step "Deploy DB" "deploy-db-local.sh"
run_step "Deploy API" "deploy-api-local.sh"
run_step "Deploy Admin" "deploy-admin-local.sh"
run_step "Deploy Web" "deploy-web-local.sh"

echo -e "${GREEN}=== All services deployed successfully ===${NC}"
echo "Summary:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep -E "NAMES|postgres-db|atk-api|dashboard-admin|dashboard-web" || true

