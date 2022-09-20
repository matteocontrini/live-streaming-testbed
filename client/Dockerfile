FROM node:16-bullseye

ENV DEBIAN_FRONTEND noninteractive

RUN apt-get update && \
    apt-get install -y ca-certificates curl libnss3-tools chromium && \
    rm -rf /var/lib/apt/lists/*

RUN wget -q -O chromium-ffmpeg.deb http://ports.ubuntu.com/pool/universe/c/chromium-browser/chromium-codecs-ffmpeg-extra_80.0.3987.163-0ubuntu1_$(dpkg --print-architecture).deb && \
    dpkg -i chromium-ffmpeg.deb

WORKDIR /client

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Build backend
COPY package*.json ./
COPY tsconfig.json .
COPY src src
RUN npm ci && npm run build

# Build frontend
COPY frontend frontend
RUN cd frontend && npm ci && npm run build

# Copy run script
COPY run.sh .

ENTRYPOINT ["./run.sh"]
