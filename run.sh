#!/bin/bash

# Get the current timestamp
TIMESTAMP=$(date +%s)

# Print the timestamp
echo "Running Docker Compose with TIMESTAMP=$TIMESTAMP"

export TIMESTAMP

# Run Docker Compose commands
docker-compose down -v
docker image prune -f
docker-compose up -d --build