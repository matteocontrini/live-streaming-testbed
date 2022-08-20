#!/bin/bash
cd live-source
docker build -t live-source .

cd ../cdn
docker build -t cdn .

cd ../client
docker build -t client .

docker image prune -f

sudo pip3 install bottle
