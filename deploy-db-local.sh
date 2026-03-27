#!/bin/bash
set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}=== ATK DB Local Deployment ===${NC}\n"

# Configuration (override with env vars if needed)
DB_CONTAINER_NAME="${DB_CONTAINER_NAME:-postgres-db}"
DB_IMAGE="${DB_IMAGE:-postgres:16-alpine}"
DB_USER="${DB_USER:-postgres}"
DB_PASSWORD="${DB_PASSWORD:-postgres}"
DB_NAME="${DB_NAME:-atk}"
DB_HOST_PORT="${DB_HOST_PORT:-5432}"
DB_CONTAINER_PORT="${DB_CONTAINER_PORT:-5432}"
DB_VOLUME="${DB_VOLUME:-atk}"
NETWORK_NAME="${NETWORK_NAME:-atk-net}"

# Step 1: Ensure network exists
echo -e "${YELLOW}Step 1: Ensuring Docker network...${NC}"
docker network create "$NETWORK_NAME" >/dev/null 2>&1 || true
echo -e "${GREEN}✓ Network ready: $NETWORK_NAME${NC}\n"

# Step 2: Ensure volume exists
echo -e "${YELLOW}Step 2: Ensuring Docker volume...${NC}"
docker volume create "$DB_VOLUME" >/dev/null 2>&1 || true
echo -e "${GREEN}✓ Volume ready: $DB_VOLUME${NC}\n"

# Step 3: Pull image
echo -e "${YELLOW}Step 3: Pulling PostgreSQL image...${NC}"
docker pull "$DB_IMAGE" >/dev/null
echo -e "${GREEN}✓ Image ready: $DB_IMAGE${NC}\n"

# Step 4: Create or start container
echo -e "${YELLOW}Step 4: Creating/starting DB container...${NC}"
if docker ps -a --format '{{.Names}}' | grep -q "^${DB_CONTAINER_NAME}$"; then
  # Start if currently stopped
  if [ "$(docker inspect -f '{{.State.Running}}' "$DB_CONTAINER_NAME")" != "true" ]; then
    docker start "$DB_CONTAINER_NAME" >/dev/null
  fi
else
  docker run -d \
    --name "$DB_CONTAINER_NAME" \
    --network "$NETWORK_NAME" \
    -e POSTGRES_USER="$DB_USER" \
    -e POSTGRES_PASSWORD="$DB_PASSWORD" \
    -e POSTGRES_DB="$DB_NAME" \
    -p "${DB_HOST_PORT}:${DB_CONTAINER_PORT}" \
    -v "$DB_VOLUME:/var/lib/postgresql/data" \
    --restart unless-stopped \
    "$DB_IMAGE" >/dev/null
fi

# Step 5: Ensure container is attached to network
if ! docker network inspect "$NETWORK_NAME" --format '{{json .Containers}}' | grep -q "\"Name\":\"${DB_CONTAINER_NAME}\""; then
  docker network connect "$NETWORK_NAME" "$DB_CONTAINER_NAME" >/dev/null 2>&1 || true
fi

echo -e "${GREEN}✓ Container ready: $DB_CONTAINER_NAME${NC}\n"

# Step 6: Wait for readiness
echo -e "${YELLOW}Step 6: Waiting for PostgreSQL readiness...${NC}"
for i in $(seq 1 30); do
  if docker exec "$DB_CONTAINER_NAME" pg_isready -U "$DB_USER" -d "$DB_NAME" >/dev/null 2>&1; then
    echo -e "${GREEN}✓ PostgreSQL is ready${NC}\n"
    break
  fi
  if [ "$i" -eq 30 ]; then
    echo -e "${RED}✗ PostgreSQL did not become ready in time${NC}"
    echo "Check logs: docker logs $DB_CONTAINER_NAME"
    exit 1
  fi
  sleep 1
done

# Final status
echo -e "${GREEN}=== DB Deployment Complete ===${NC}"
echo "Container: $DB_CONTAINER_NAME"
echo "Image: $DB_IMAGE"
echo "Network: $NETWORK_NAME"
echo "Port: ${DB_HOST_PORT}:${DB_CONTAINER_PORT}"
echo "Volume: $DB_VOLUME"
echo "DATABASE_URL: postgresql://${DB_USER}:${DB_PASSWORD}@${DB_CONTAINER_NAME}:${DB_CONTAINER_PORT}/${DB_NAME}"

echo
 docker ps --filter "name=$DB_CONTAINER_NAME" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

