#!/bin/bash
mkcert -install
mkcert cdn.local

mkdir -p /h2o/certs
mv cdn.local*.pem /h2o/certs
cp $(mkcert -CAROOT)/rootCA*.pem /h2o/certs

h2o -c /h2o/h2o.conf
