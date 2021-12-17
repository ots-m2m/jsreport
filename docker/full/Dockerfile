FROM ubuntu:xenial
# not using ubuntu:bionic because phantomjs 1.9.8 does not work there
# (it contains a newer version of OpenSSL which can not be used with phantomjs)
EXPOSE 5488

RUN adduser --disabled-password --gecos "" jsreport && \
    apt-get update && \   
    apt-get install -y --no-install-recommends libgconf-2-4 gnupg git curl wget ca-certificates && \   
    # phantom/electron
    apt-get install -y --no-install-recommends libgtk2.0-dev \
        libxtst-dev \
        libxss1 \
        libgconf2-dev \
        libnss3-dev \
        libasound2-dev \
        xvfb \
        xfonts-75dpi \
        xfonts-base && \           
    # java fop
    apt-get install -y default-jre unzip && \
    curl -o fop.zip https://dlcdn.apache.org//xmlgraphics/fop/binaries/fop-2.6-bin.zip && \
    unzip fop.zip && \
    rm fop.zip && \
    chmod +x fop-2.6/fop && \
    # node
    curl -sL https://deb.nodesource.com/setup_12.x | bash - && \
    apt-get update && \
    apt-get install -y --no-install-recommends nodejs && \
    npm i -g npm && \
    # chrome
    apt-get install -y libgconf-2-4 && \
    wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - && \
    sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' && \
    apt-get update && \
    apt-get install -y google-chrome-unstable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst --no-install-recommends && \
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

# the chrome was already installed from apt-get
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true  

RUN npm install -g jsreport-cli && \
    jsreport init && \
    npm uninstall -g jsreport-cli

RUN npm install -g node-gyp
    
RUN npm install --save --save-exact jsreport-ejs 
#\
RUN npm install --save --save-exact        jsreport-pug 
#\    
RUN npm install --save --save-exact        jsreport-azure-storage 
#\
RUN npm install --save --save-exact        jsreport-pdf-password 
#\       
RUN npm install --save --save-exact        jsreport-phantom-pdf 
#\
RUN npm install --save --save-exact        jsreport-phantom-image 
#\
RUN npm install --save --save-exact        jsreport-mssql-store 
#\
RUN npm install --save --save-exact        jsreport-postgres-store 
#\
RUN npm install --save --save-exact        jsreport-mongodb-store 
#\
RUN npm install --save --save-exact        jsreport-wkhtmltopdf 
#\
RUN npm install --save --save-exact        jsreport-html-to-text 
#\
RUN npm install --save --save-exact        jsreport-fop-pdf 
#\
RUN npm install --save --save-exact        jsreport-html-embedded-in-docx 
#\
RUN npm install --save --save-exact        jsreport-fs-store-aws-s3-persistence 
#\
RUN npm install --save --save-exact        jsreport-fs-store-azure-storage-persistence 
#\
RUN npm install --save --save-exact        jsreport-fs-store-azure-sb-sync 
#\
RUN npm install --save --save-exact        jsreport-fs-store-aws-sns-sync 
#\
RUN npm install --save --save-exact	jsreport-debug 
#\
RUN npm install --save --save-exact        promise-serial 
#\
RUN npm install --save --save-exact        electron 
#\
RUN npm install --save --save-exact        jsreport-electron-pdf 
#\    
RUN npm install --save --save-exact        phantomjs-exact-2-1-1 
#\
RUN npm install --save --save-exact        request 
#\
RUN npm install --save --save-exact	moment 
#\
RUN npm install --save --save-exact        nodemailer 
#\
RUN npm install --save --save-exact	inline-css 
#\
RUN npm install --save --save-exact        @google/maps 
#\
RUN npm install --save --save-exact	aws-smtp-credentials 
#\
RUN npm install --save --save-exact        moment-timezone \
    && \    
    npm cache clean -f && \  
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
ENV chrome_launchOptions_executablePath google-chrome-unstable
ENV chrome_launchOptions_args --no-sandbox,--disable-dev-shm-usage

CMD ["bash", "/app/run.sh"]
