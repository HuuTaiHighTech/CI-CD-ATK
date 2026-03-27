#!/bin/bash
set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}=== ATK Admin Local Deployment ===${NC}\n"

# Config (override via environment variables if needed)
IMAGE_NAME="${ADMIN_IMAGE_NAME:-atk-admin}"
IMAGE_TAG="${ADMIN_IMAGE_TAG:-latest}"
IMAGE="${IMAGE_NAME}:${IMAGE_TAG}"
CONTAINER_NAME="${ADMIN_CONTAINER_NAME:-dashboard-admin}"
NETWORK_NAME="${NETWORK_NAME:-atk-net}"
HOST_PORT="${ADMIN_HOST_PORT:-5173}"
CONTAINER_PORT="${ADMIN_CONTAINER_PORT:-80}"
BUILD_ENV_FILE="${ADMIN_BUILD_ENV_FILE:-admin/.env}"
RUNTIME_ENV_FILE="${ADMIN_RUNTIME_ENV_FILE:-/tmp/dashboard-admin.env}"

# Step 1: Validate build env file
if [ ! -f "$BUILD_ENV_FILE" ]; then
  echo -e "${RED}Error: $BUILD_ENV_FILE not found${NC}"
  echo "Create the file first (e.g. copy from admin/.env.example)."
  exit 1
fi

echo -e "${YELLOW}Step 1: Preparing runtime env file...${NC}"
cp "$BUILD_ENV_FILE" "$RUNTIME_ENV_FILE"

# Ensure API_URL exists for nginx envsubst at runtime.
if ! grep -q '^API_URL=' "$RUNTIME_ENV_FILE"; then
  # Normalize line endings from Windows env files to avoid malformed env entries.
  sed -i 's/\r$//' "$RUNTIME_ENV_FILE"

  VITE_API_URL=$(grep '^VITE_API_URL=' "$RUNTIME_ENV_FILE" | cut -d '=' -f 2-)
  if [ -z "$VITE_API_URL" ]; then
    API_URL="http://atk-api:3000"
  else
    # Convert e.g. http://localhost:3000/api -> http://localhost:3000
    API_URL=$(printf '%s' "$VITE_API_URL" | sed -E 's#/+$##' | sed -E 's#/api$##')
  fi
  # Ensure the appended key starts on a new line even if file has no trailing newline.
  printf '\nAPI_URL=%s\n' "$API_URL" >> "$RUNTIME_ENV_FILE"
fi

echo -e "${GREEN}OK: Runtime env ready at $RUNTIME_ENV_FILE${NC}\n"

# Step 2: Ensure Docker network exists
echo -e "${YELLOW}Step 2: Ensuring Docker network...${NC}"
docker network create "$NETWORK_NAME" >/dev/null 2>&1 || true
echo -e "${GREEN}OK: Network ready ($NETWORK_NAME)${NC}\n"

# Step 3: Build image
echo -e "${YELLOW}Step 3: Building admin image...${NC}"
docker build -t "$IMAGE" ./admin
echo -e "${GREEN}OK: Image built ($IMAGE)${NC}\n"

# Step 4: Replace old container if exists
echo -e "${YELLOW}Step 4: Replacing old container...${NC}"
docker stop "$CONTAINER_NAME" >/dev/null 2>&1 || true
docker rm "$CONTAINER_NAME" >/dev/null 2>&1 || true
echo -e "${GREEN}OK: Old container cleaned${NC}\n"

# Step 5: Run new container
echo -e "${YELLOW}Step 5: Starting admin container...${NC}"
docker run -d --restart=always \
  --name "$CONTAINER_NAME" \
  --env-file "$RUNTIME_ENV_FILE" \
  --network "$NETWORK_NAME" \
  -p "${HOST_PORT}:${CONTAINER_PORT}" \
  "$IMAGE" >/dev/null

echo -e "${GREEN}OK: Container started${NC}\n"

# Step 6: Cleanup dangling images
echo -e "${YELLOW}Step 6: Cleaning dangling images...${NC}"
docker image prune -f >/dev/null
echo -e "${GREEN}OK: Cleanup completed${NC}\n"

# Final status
echo -e "${GREEN}=== Admin Deployment Complete ===${NC}"
echo "Container: $CONTAINER_NAME"
echo "Image: $IMAGE"
echo "Network: $NETWORK_NAME"
echo "URL: http://localhost:$HOST_PORT"

echo
docker ps --filter "name=$CONTAINER_NAME" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

