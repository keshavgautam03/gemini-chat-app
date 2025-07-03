# Use a slim Node image
FROM node:18-alpine

# Where your app lives
WORKDIR /app

# Copy only what’s needed to install deps
COPY package.json package-lock.json ./

# Install only production deps
RUN npm ci --only=production

# Copy the rest of your source code
COPY . .

# Expose the port your app uses
EXPOSE 5001

# Run your server
CMD ["node", "src/index.js"]
