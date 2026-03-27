#!/bin/bash
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== ATK API Local Deployment ===${NC}\n"

# Configuration
IMAGE_NAME="atk-api"
IMAGE_TAG="latest"
IMAGE="${IMAGE_NAME}:${IMAGE_TAG}"
CONTAINER_NAME="atk-api"
ENV_FILE="api/.env"
UPLOADS_DIR="$(pwd)/uploads"
NETWORK_NAME="atk-net"
HOST_PORT="${DASHBOARD_SERVER_HOST_PORT:-3000}"
CONTAINER_PORT="${DASHBOARD_SERVER_CONTAINER_PORT:-3000}"

# Validate .env file exists
if [ ! -f "$ENV_FILE" ]; then
  echo -e "${RED}❌ Error: $ENV_FILE not found!${NC}"
  echo "Please create $ENV_FILE with required environment variables."
  exit 1
fi

# Step 1: Create Docker network
echo -e "${YELLOW}Step 1: Creating Docker network...${NC}"
docker network create "$NETWORK_NAME" >/dev/null 2>&1 || true
echo -e "${GREEN}✓ Network ready${NC}\n"

# Step 2: Create uploads directory
echo -e "${YELLOW}Step 2: Creating uploads directory...${NC}"
mkdir -p "$UPLOADS_DIR"
echo -e "${GREEN}✓ Uploads directory: $UPLOADS_DIR${NC}\n"

# Step 3: Build Docker image
echo -e "${YELLOW}Step 3: Building Docker image...${NC}"
docker build -t "$IMAGE" ./api
echo -e "${GREEN}✓ Image built: $IMAGE${NC}\n"

# Step 4: Backup and stop old container
echo -e "${YELLOW}Step 4: Backing up old container...${NC}"
if docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
  echo "Backing up old uploads..."
  docker cp "$CONTAINER_NAME":/app/public/. "$UPLOADS_DIR" >/dev/null 2>&1 || true
  
  echo "Stopping old container..."
  docker stop "$CONTAINER_NAME" || true
  docker rm "$CONTAINER_NAME" || true
  echo -e "${GREEN}✓ Old container cleaned${NC}\n"
else
  echo -e "${GREEN}✓ No old container to clean${NC}\n"
fi

# Step 5: Run Prisma migrations
echo -e "${YELLOW}Step 5: Running Prisma migrations...${NC}"
docker run --rm \
  --name "${CONTAINER_NAME}-migrate" \
  --env-file "$ENV_FILE" \
  --network "$NETWORK_NAME" \
  "$IMAGE" \
  sh -c "npx prisma generate && npx prisma migrate deploy && npm run prisma:seed"
echo -e "${GREEN}✓ Migrations completed${NC}\n"

# Step 6: Start new container
echo -e "${YELLOW}Step 6: Starting API container...${NC}"
docker run -d --restart=always \
  --name "$CONTAINER_NAME" \
  --env-file "$ENV_FILE" \
  --network "$NETWORK_NAME" \
  -p "${HOST_PORT}:${CONTAINER_PORT}" \
  -v "$UPLOADS_DIR:/app/public" \
  "$IMAGE"
echo -e "${GREEN}✓ Container started${NC}\n"

# Step 7: Cleanup and show status
echo -e "${YELLOW}Step 7: Cleaning up...${NC}"
docker image prune -f >/dev/null
echo -e "${GREEN}✓ Cleanup done${NC}\n"

# Final status
echo -e "${GREEN}=== Deployment Complete ===${NC}"
echo -e "Container: ${YELLOW}$CONTAINER_NAME${NC}"
echo -e "Image: ${YELLOW}$IMAGE${NC}"
echo -e "Network: ${YELLOW}$NETWORK_NAME${NC}"
echo -e "API URL: ${YELLOW}http://localhost:${HOST_PORT}${NC}"
echo -e "Uploads Dir: ${YELLOW}$UPLOADS_DIR${NC}\n"

echo "Container Status:"
docker ps --filter "name=$CONTAINER_NAME" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo -e "\n${GREEN}✅ API is running!${NC}"

