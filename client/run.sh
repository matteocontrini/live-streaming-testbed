#!/bin/bash

echo "Hello!"

while true; do
    echo "Waiting for rootCA.pem to be available..."
    sleep 1
    wget -q http://cdn.local/certs/rootCA.pem && break
done

echo "Installing root CA"

mkdir -p $HOME/.pki/nssdb
certutil -d sql:$HOME/.pki/nssdb -N --empty-password
certutil -d sql:$HOME/.pki/nssdb -A -t "C,," -n mkcert -i rootCA.pem
certutil -d sql:$HOME/.pki/nssdb -L

while true; do
    echo "Waiting for manifest.mpd to be available..."
    curl -s -f -o /dev/null -k https://cdn.local/manifest.mpd && break
    sleep 1
done

echo "OK"

echo "Fixing DNS resolution..."
echo "nameserver 8.8.8.8" > /etc/resolv.conf
cat /etc/resolv.conf

echo "Starting the client..."

npm run start
