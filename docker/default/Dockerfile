FROM debian:bullseye-slim

EXPOSE 5488

# Install system dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        ca-certificates \
        curl \
        wget \
        git \
        bash \
        python3 \
        make \
        g++ \
        libgconf-2-4 \
        libgtk2.0-0 \
        libxtst6 \
        libxss1 \
        libnss3 \
        libasound2 \
        xvfb \
        xfonts-75dpi \
        xfonts-base \
        default-jre \
        unzip \
        bzip2 \
        fonts-ipafont-gothic \
        fonts-wqy-zenhei \
        fonts-thai-tlwg \
        fonts-kacst \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js 18 LTS
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get update && \
    apt-get install -y --no-install-recommends nodejs && \
    rm -rf /var/lib/apt/lists/*

# Install Chromium
RUN apt-get update && \
    apt-get install -y --no-install-recommends chromium && \
    rm -rf /var/lib/apt/lists/*

RUN rm -f /etc/apt/sources.list.d/google-chrome.list

VOLUME ["/jsreport"]

RUN adduser --disabled-password --gecos "" jsreport
RUN mkdir -p /app
WORKDIR /app

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV NODE_ENV=production
ENV chrome:launchOptions:executablePath=/usr/bin/chromium
ENV chrome:launchOptions:args=--no-sandbox,--disable-dev-shm-usage
ENV templatingEngines:strategy=http-server

# Install jsreport and initialize
RUN npm install -g jsreport-cli && \
    jsreport init && \
    npm uninstall -g jsreport-cli && \
    npm cache clean --force

COPY editConfig.js /app/editConfig.js
RUN node editConfig.js

ADD run.sh /app/run.sh
COPY . /app

CMD ["bash", "/app/run.sh"]
