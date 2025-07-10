FROM ubuntu:xenial
EXPOSE 5488

RUN adduser --disabled-password --gecos "" jsreport && \
    apt-get update && \
    apt-get install -y --no-install-recommends \
        git \
        bash \
        ca-certificates \
        wget \
        curl \
        python \
        make \
        g++ \
        libgconf-2-4 \
        libgtk2.0-dev libxtst-dev libxss1 libgconf2-dev libnss3-dev \
        libasound2-dev xvfb xfonts-75dpi xfonts-base \
        default-jre unzip bzip2 && \
    # chromium
    apt-get install -y chromium-browser && \
    # node 16 (modern, hummus-free)
    curl -fsSL https://deb.nodesource.com/setup_16.x | bash - && \
    apt-get install -y --no-install-recommends nodejs && \
    # cleanup
    rm -rf /var/lib/apt/lists/* /var/cache/apt/* && \
    rm -rf /tmp/*

VOLUME ["/jsreport"]
RUN mkdir -p /app
WORKDIR /app

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

RUN npm install -g jsreport-cli && \
    jsreport init && \
    npm uninstall -g jsreport-cli && \
    npm cache clean -f

COPY editConfig.js /app/editConfig.js
RUN node editConfig.js

ADD run.sh /app/run.sh
COPY . /app

ENV NODE_ENV production
ENV chrome:launchOptions:executablePath /usr/bin/chromium-browser
ENV chrome:launchOptions:args --no-sandbox
ENV templatingEngines:strategy http-server

CMD ["bash", "/app/run.sh"]
