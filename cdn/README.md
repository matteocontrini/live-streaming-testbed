This directory contains the configuration to run an HTTP server to serve the DASH streaming files (manifest + video/audio segments).

The server is [h2o](https://github.com/h2o/h2o) by Fastly.

To run the server outside the ComNetsEmu emulation, use the Docker Compose file.

```shell
docker-compose -f docker-compose.dev.yml up
```
