#!/bin/bash
set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}=== ATK Web Local Deployment ===${NC}\n"

# Config (override via environment variables if needed)
IMAGE_NAME="${WEB_IMAGE_NAME:-atk-web}"
IMAGE_TAG="${WEB_IMAGE_TAG:-latest}"
IMAGE="${IMAGE_NAME}:${IMAGE_TAG}"
CONTAINER_NAME="${WEB_CONTAINER_NAME:-dashboard-web}"
NETWORK_NAME="${NETWORK_NAME:-atk-net}"
HOST_PORT="${WEB_HOST_PORT:-8080}"
CONTAINER_PORT="${WEB_CONTAINER_PORT:-3000}"
ENV_FILE="${WEB_ENV_FILE:-web/.env}"

# Step 1: Validate env file
if [ ! -f "$ENV_FILE" ]; then
  echo -e "${RED}Error: $ENV_FILE not found${NC}"
  echo "Create the file first (for example from web/.env.example)."
  exit 1
fi

echo -e "${GREEN}OK: Found env file ($ENV_FILE)${NC}\n"

# Step 2: Ensure Docker network exists
echo -e "${YELLOW}Step 2: Ensuring Docker network...${NC}"
docker network create "$NETWORK_NAME" >/dev/null 2>&1 || true
echo -e "${GREEN}OK: Network ready ($NETWORK_NAME)${NC}\n"

# Step 3: Build image
echo -e "${YELLOW}Step 3: Building web image...${NC}"
docker build -t "$IMAGE" ./web
echo -e "${GREEN}OK: Image built ($IMAGE)${NC}\n"

# Step 4: Replace old container
echo -e "${YELLOW}Step 4: Replacing old container...${NC}"
docker stop "$CONTAINER_NAME" >/dev/null 2>&1 || true
docker rm "$CONTAINER_NAME" >/dev/null 2>&1 || true
echo -e "${GREEN}OK: Old container cleaned${NC}\n"

# Step 5: Start new container
echo -e "${YELLOW}Step 5: Starting web container...${NC}"
docker run -d --restart=always \
  --name "$CONTAINER_NAME" \
  --env-file "$ENV_FILE" \
  --network "$NETWORK_NAME" \
  -p "${HOST_PORT}:${CONTAINER_PORT}" \
  "$IMAGE" >/dev/null

echo -e "${GREEN}OK: Container started${NC}\n"

# Step 6: Cleanup dangling images
echo -e "${YELLOW}Step 6: Cleaning dangling images...${NC}"
docker image prune -f >/dev/null
echo -e "${GREEN}OK: Cleanup completed${NC}\n"

# Final status
echo -e "${GREEN}=== Web Deployment Complete ===${NC}"
echo "Container: $CONTAINER_NAME"
echo "Image: $IMAGE"
echo "Network: $NETWORK_NAME"
echo "URL: http://localhost:$HOST_PORT"

echo
docker ps --filter "name=$CONTAINER_NAME" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

