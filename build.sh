#!/bin/bash
cd live-source
docker build -t live-source . || { echo 'Live source build failed' ; exit 1; }

cd ../cdn
docker build -t cdn . || { echo 'CDN build failed' ; exit 1; }

cd ../client
docker build -t client . || { echo 'Client build failed' ; exit 1; }

docker image prune -f

sudo pip3 install bottle
