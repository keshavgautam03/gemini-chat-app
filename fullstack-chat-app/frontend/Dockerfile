# 1) Build step: compile your Vite/React app
FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build      # outputs to /app/dist by default

# 2) Serve step: nginx with custom proxy rules
FROM nginx:stable-alpine
# (make sure nginx.conf is next to this Dockerfile)
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
