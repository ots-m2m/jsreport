FROM node:18-bullseye
EXPOSE 5488

RUN addgroup --system jsreport && adduser --system --ingroup jsreport jsreport

RUN npm install puppeteer

VOLUME ["/jsreport"]
RUN mkdir -p /app
WORKDIR /app

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

RUN npm install -g jsreport-cli && \
    jsreport init && \
    npm uninstall -g jsreport-cli && \
    npm cache clean -f 
RUN npm install aws-sdk --save

COPY editConfig.js /app/editConfig.js
RUN node editConfig.js    

ADD run.sh /app/run.sh
COPY . /app

ENV NODE_ENV production
ENV chrome:launchOptions:executablePath /usr/bin/google-chrome
ENV chrome:launchOptions:args --no-sandbox
ENV templatingEngines:strategy http-server

CMD ["bash", "/app/run.sh"]
