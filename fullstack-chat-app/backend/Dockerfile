# 1) Use a slim Node image
FROM node:18-alpine

# 2) Create app dir
WORKDIR /app

# 3) Install only production deps
COPY package.json package-lock.json ./
RUN npm ci --only=production

# 4) Copy source
COPY . .

# 5) Expose the API port
EXPOSE 5001

# 6) Start your Express/socket server
CMD ["node", "src/index.js"]