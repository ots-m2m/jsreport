FROM debian:bullseye
EXPOSE 5488

RUN adduser --disabled-password --gecos "" jsreport && \
    apt-get update && \
    apt-get install -y --no-install-recommends \
        libgconf-2-4 gnupg git curl wget ca-certificates \
        libgtk2.0-dev libxtst-dev libxss1 libgconf2-dev libnss3-dev \
        libasound2-dev xvfb xfonts-75dpi xfonts-base \
        default-jre unzip \
        bzip2 && \
    # java fop
    curl -Lo fop.zip https://archive.apache.org/dist/xmlgraphics/fop/binaries/fop-2.1-bin.zip && \
    unzip fop.zip && \
    rm fop.zip && \
    chmod +x fop-2.1/fop && \
    # node 18
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y --no-install-recommends nodejs && \
    # chrome
    wget -q -O /usr/share/keyrings/google-linux-signing-keyring.gpg https://dl.google.com/linux/linux_signing_key.pub && \
    echo "deb [arch=amd64 signed-by=/usr/share/keyrings/google-linux-signing-keyring.gpg] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list && \
    apt-get update && \
    apt-get install -y --no-install-recommends google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst && \
    # phantomjs
    curl -Lo phantomjs.tar.bz2 https://bitbucket.org/ariya/phantomjs/downloads/phantomjs-1.9.8-linux-x86_64.tar.bz2 && \
    tar jxvf phantomjs.tar.bz2 && \
    chmod +x phantomjs-1.9.8-linux-x86_64/bin/phantomjs && \
    mv phantomjs-1.9.8-linux-x86_64/bin/phantomjs /usr/local/bin/ && \
    rm -rf phantomjs* && \
    # cleanup
    rm -rf /var/lib/apt/lists/* /var/cache/apt/* && \
    rm -rf /src/*.deb

VOLUME ["/jsreport"]

RUN mkdir -p /app
WORKDIR /app

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

RUN npm install -g jsreport-cli && \
    jsreport init && \
    npm uninstall -g jsreport-cli
    
RUN apt-get update && apt-get install -y python3 make g++ && \
    npm install -g node-gyp node-pre-gyp

RUN npm install --save --save-exact jsreport-ejs \
        jsreport-pug \
        jsreport-azure-storage \
        jsreport-pdf-password \
        jsreport-mssql-store \
        jsreport-postgres-store \
        jsreport-mongodb-store \
        jsreport-wkhtmltopdf@latest \
        jsreport-html-to-text \
        jsreport-html-embedded-in-docx \
        jsreport-fs-store-aws-s3-persistence \
        jsreport-fs-store-azure-storage-persistence \
        jsreport-fs-store-azure-sb-sync \
        jsreport-fs-store-aws-sns-sync \
        jsreport-debug \
        promise-serial \
        electron \
        jsreport-electron-pdf \
        request \
        moment \
        nodemailer \
        inline-css \
        @google/maps \
        aws-smtp-credentials \
        moment-timezone \
        jsreport-chrome-pdf \
    && npm cache clean -f && \
    rm -rf /tmp/*

COPY editConfig.js /app/editConfig.js
RUN node editConfig.js

ADD run.sh /app/run.sh
COPY . /app



ENV PATH "$PATH:/fop-2.1"
ENV NODE_ENV production
ENV electron:strategy electron-ipc
ENV phantom:strategy phantom-server
ENV templatingEngines:strategy http-server
ENV chrome_launchOptions_executablePath /usr/bin/google-chrome-stable
ENV chrome_launchOptions_args --no-sandbox,--disable-dev-shm-usage

CMD ["bash", "/app/run.sh"]
