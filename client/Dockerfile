FROM node:16-bullseye

ENV DEBIAN_FRONTEND noninteractive

RUN apt-get update && \
    apt-get install -y ca-certificates curl chromium libnss3-tools && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /src

# Build frontend
COPY frontend frontend
RUN cd frontend && npm ci && npm run build

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Build backend
COPY package*.json ./
COPY tsconfig.json .
COPY src src
RUN npm ci && npm run build

# Copy run script
COPY run.sh .

ENTRYPOINT ["./run.sh"]
