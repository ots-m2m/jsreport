FROM node:18-slim

ENV NODE_ENV=production \
    CHROME_BIN=/usr/bin/google-chrome \
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

# Create non-root user
RUN adduser --disabled-password --gecos "" jsreport

# Install system dependencies (including those needed for phantomjs, electron, FOP, etc.)
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        curl gnupg ca-certificates git wget \
        libxss1 libappindicator3-1 libasound2 libatk-bridge2.0-0 libnspr4 libnss3 \
        fonts-liberation libgtk-3-0 libx11-xcb1 libxcomposite1 libxdamage1 libxrandr2 \
        libgbm1 libpango-1.0-0 libcairo2 libatspi2.0-0 libdrm2 libxext6 libxfixes3 libxrender1 \
        libxtst6 libx11-6 libglib2.0-0 xdg-utils xvfb unzip \
        libgconf-2-4 libgtk2.0-dev libxtst-dev libgconf2-dev libnss3-dev libasound2-dev \
        xfonts-75dpi xfonts-base default-jre \
        bzip2 curl gnupg ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Install Apache FOP
RUN curl -o fop.zip https://archive.apache.org/dist/xmlgraphics/fop/binaries/fop-2.1-bin.zip && \
    unzip fop.zip && \
    rm fop.zip && \
    chmod +x fop-2.1/fop

# Install PhantomJS 1.9.8
RUN curl -Lo phantomjs.tar.bz2 https://bitbucket.org/ariya/phantomjs/downloads/phantomjs-1.9.8-linux-x86_64.tar.bz2 && \
    tar jxvf phantomjs.tar.bz2 && \
    chmod +x phantomjs-1.9.8-linux-x86_64/bin/phantomjs && \
    mv phantomjs-1.9.8-linux-x86_64/bin/phantomjs /usr/local/bin/ && \
    rm -rf phantomjs*

# Add Google Chrome GPG key and repo securely (2025 compatible)
RUN mkdir -p /etc/apt/keyrings && \
    curl -fsSL https://dl.google.com/linux/linux_signing_key.pub | gpg --dearmor -o /etc/apt/keyrings/google-chrome.gpg && \
    echo "deb [arch=amd64 signed-by=/etc/apt/keyrings/google-chrome.gpg] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list

# Install Google Chrome
RUN apt-get update && \
    apt-get install -y --no-install-recommends google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst && \
    rm -rf /var/lib/apt/lists/*

VOLUME ["/jsreport"]
RUN mkdir -p /app
WORKDIR /app

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
ENV PATH="$PATH:/fop-2.1"

RUN npm install -g jsreport-cli && \
    jsreport init && \
    npm uninstall -g jsreport-cli

# Install all required jsreport extensions and dependencies
RUN npm install --save --save-exact \
        jsreport-ejs \
        jsreport-pug \
        jsreport-azure-storage \
        jsreport-pdf-password \
        jsreport-phantom-pdf \
        jsreport-phantom-image \
        jsreport-mssql-store \
        jsreport-postgres-store \
        jsreport-mongodb-store \
        jsreport-wkhtmltopdf \
        jsreport-html-to-text \
        jsreport-fop-pdf \
        jsreport-html-embedded-in-docx \
        jsreport-fs-store-aws-s3-persistence \
        jsreport-fs-store-azure-storage-persistence \
        jsreport-fs-store-azure-sb-sync \
        jsreport-fs-store-aws-sns-sync \
        jsreport-debug \
        promise-serial \
        electron \
        jsreport-electron-pdf \
        phantomjs-exact-2-1-1 \
        request \
        moment \
        nodemailer \
        inline-css \
        @google/maps \
        aws-smtp-credentials \
        moment-timezone \
        aws-sdk \
    && npm cache clean --force && \
    rm -rf /tmp/*

COPY editConfig.js /app/editConfig.js
RUN node editConfig.js

ADD run.sh /app/run.sh
COPY . /app

ENV NODE_ENV production
ENV electron:strategy electron-ipc
ENV phantom:strategy phantom-server
ENV templatingEngines:strategy http-server
ENV chrome:launchOptions:executablePath /usr/bin/google-chrome
ENV chrome:launchOptions:args --no-sandbox,--disable-dev-shm-usage

CMD ["bash", "/app/run.sh"]

# Set ownership to non-root user
RUN chown -R jsreport:jsreport /home/jsreport

USER jsreport

EXPOSE 5488

