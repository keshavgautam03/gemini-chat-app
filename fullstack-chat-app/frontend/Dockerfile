# 1) Build step
FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build        # outputs to /app/dist by default

# 2) Serve step
FROM nginx:stable-alpine
# Override the default nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Copy in built assets
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
