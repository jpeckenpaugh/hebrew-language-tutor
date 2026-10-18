FROM mcr.microsoft.com/playwright:v1.55.0-noble

# Install ffmpeg, graphic libs, and Hebrew fonts to prevent tofu characters and ensure proper diacritic rendering
RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg \
    fonts-noto-core \
    fonts-noto-extra \
    culmus \
    culmus-fancy \
    fonts-sil-ezra \
    fonts-dejavu-core \
    fonts-liberation \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /runner
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY runner.mjs ./
ENTRYPOINT ["node", "runner.mjs"]
