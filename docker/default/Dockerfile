FROM node:18-slim

# Set environment variables
ENV JSREPORT_VERSION=3.13.0 \
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    NODE_ENV=production \
    CHROME_BIN=/usr/bin/google-chrome

# Create non-root user
RUN adduser --disabled-password --gecos "" jsreport

# Install required packages and Chrome public key
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        gnupg curl wget ca-certificates \
        libxss1 libappindicator3-1 libasound2 libatk-bridge2.0-0 libnspr4 libnss3 \
        fonts-liberation libgtk-3-0 libx11-xcb1 libxcomposite1 libxdamage1 libxrandr2 \
        libgbm1 libpango-1.0-0 libcairo2 libatspi2.0-0 libdrm2 libxext6 libxfixes3 libxrender1 \
        libxtst6 libx11-6 libglib2.0-0 xdg-utils xvfb unzip \
        && rm -rf /var/lib/apt/lists/*

# Add Google Chrome repo and key
RUN curl -fsSL https://dl.google.com/linux/linux_signing_key.pub | gpg --dearmor -o /usr/share/keyrings/google-linux-signing-key.gpg && \
    echo "deb [arch=amd64 signed-by=/usr/share/keyrings/google-linux-signing-key.gpg] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list && \
    apt-get update && \
    apt-get install -y google-chrome-stable && \
    rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /home/jsreport

# Install jsreport (you can change this to use a custom jsreport config/project)
COPY package*.json ./
RUN npm install --production

# Copy rest of the app
COPY . .

# Change ownership
RUN chown -R jsreport:jsreport /home/jsreport

# Switch to non-root user
USER jsreport

# Expose port
EXPOSE 5488

# Start jsreport
CMD ["npx", "jsreport", "start"]
