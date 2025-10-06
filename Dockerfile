FROM node:24-alpine3.19 AS builder
WORKDIR /app
COPY package*.json ./
RUN apk update && apk upgrade && npm ci
COPY . .
RUN npm run build

FROM node:24-alpine3.19 AS runner
WORKDIR /app
COPY --from=builder /app/package*.json ./
RUN apk update && apk upgrade && npm ci --omit=dev
COPY --from=builder /app/dist ./dist
COPY .env ./.env
EXPOSE 3000
CMD ["node", "dist/apps/api/main.js"]
