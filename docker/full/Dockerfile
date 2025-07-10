FROM node:18-slim

ENV NODE_ENV=production \
    CHROME_BIN=/usr/bin/google-chrome \
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

# Create non-root user
RUN adduser --disabled-password --gecos "" jsreport

# Install system dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        curl gnupg ca-certificates \
        libxss1 libappindicator3-1 libasound2 libatk-bridge2.0-0 libnspr4 libnss3 \
        fonts-liberation libgtk-3-0 libx11-xcb1 libxcomposite1 libxdamage1 libxrandr2 \
        libgbm1 libpango-1.0-0 libcairo2 libatspi2.0-0 libdrm2 libxext6 libxfixes3 libxrender1 \
        libxtst6 libx11-6 libglib2.0-0 xdg-utils xvfb unzip \
    && rm -rf /var/lib/apt/lists/*

# Fix: Add Google Chrome GPG key and repo securely (2025 compatible)
RUN mkdir -p /etc/apt/keyrings && \
    curl -fsSL https://dl.google.com/linux/linux_signing_key.pub | gpg --dearmor -o /etc/apt/keyrings/google-chrome.gpg && \
    echo "deb [arch=amd64 signed-by=/etc/apt/keyrings/google-chrome.gpg] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list

# Install Google Chrome
RUN apt-get update && \
    apt-get install -y --no-install-recommends google-chrome-stable && \
    rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /home/jsreport

# Copy dependencies and install jsreport
COPY package*.json ./
RUN npm install --production

# Copy rest of app
COPY . .

# Set ownership to non-root user
RUN chown -R jsreport:jsreport /home/jsreport

# Use non-root user
USER jsreport

EXPOSE 5488

# Start jsreport
CMD ["npx", "jsreport", "start"]
