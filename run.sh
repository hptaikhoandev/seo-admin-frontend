#!/bin/bash

# Get the current timestamp
TIMESTAMP=$(date +%s)

echo "Starting deployment process with TIMESTAMP=$TIMESTAMP"

# Export timestamp for use in Dockerfile if needed
export TIMESTAMP

# Pull latest code
git pull origin main

# Stop and clean up old containers and images
docker-compose down -v
docker image prune -f

# Build new images without cache
docker-compose build --no-cache

# Start containers
docker-compose up -d

echo "Deployment completed successfully!"
