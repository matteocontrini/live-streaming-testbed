#!/bin/bash

echo "⏳ Waiting for client container to start..."
echo ""

while :; do
  if [ $(docker ps -q -f name=client) ]; then
    docker logs client -f
    echo ""
    echo ""
    echo "✅ Client container stopped"
    echo "⏳ Waiting for client container to start..."
    echo ""
  fi
  sleep 2
done
