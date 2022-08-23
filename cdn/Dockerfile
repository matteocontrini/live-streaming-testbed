FROM ubuntu:20.04

ENV DEBIAN_FRONTEND=noninteractive

WORKDIR /src

RUN apt-get update -y \
    && apt-get install -y \
        git \
        wget \
        clang \
        cmake \
        pkgconf \
        libssl-dev \
        zlib1g-dev \
        libbrotli-dev \
        # required by mkcert
        libnss3-tools \
    && rm -rf /var/lib/apt/lists/*

RUN git clone --recurse-submodules https://github.com/matteocontrini/h2o.git

RUN mkdir -p /src/h2o/build && \
    cd /src/h2o/build && \
    cmake .. && \
    make -j$(nproc) && \
    make install

RUN mkdir -p /src/mkcert && \
    cd /src/mkcert && \
    wget https://github.com/FiloSottile/mkcert/releases/download/v1.4.4/mkcert-v1.4.4-linux-arm64 && \
    chmod +x mkcert-v*-linux-arm64 && \
    cp mkcert-v*-linux-arm64 /usr/local/bin/mkcert

RUN rm -rf /src
WORKDIR /h2o

COPY run.sh .
COPY h2o.conf .

CMD ["./run.sh"]
