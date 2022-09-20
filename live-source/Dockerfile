FROM dev_test

ENV DEBIAN_FRONTEND noninteractive

WORKDIR /root

RUN apt-get update && \
    apt-get install -y --no-install-recommends wget ca-certificates xz-utils && \
    rm -rf /var/lib/apt/lists/*

RUN mkdir ffmpeg && \
    cd ffmpeg && \
    wget -q https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-arm64-static.tar.xz && \
    tar --strip-components 1 -xJf ffmpeg-release-arm64-static.tar.xz && \
    mv ffmpeg /usr/bin/ffmpeg && \
    chmod u+x /usr/bin/ffmpeg && \
    cd - && \
    rm -rf ffmpeg

COPY abr.sh .

CMD ["./abr.sh", "/live/source/abr.mp4", "/live/www"]
