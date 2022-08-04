FROM node:16-bullseye

ENV DEBIAN_FRONTEND noninteractive

RUN apt-get update && \
    apt-get install -y ca-certificates curl chromium libnss3-tools dnsutils && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /src

COPY package*.json ./

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

RUN npm ci

COPY src .
COPY static static
COPY run.sh .

ENTRYPOINT ["./run.sh"]
