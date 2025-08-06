FROM node:18 AS builder

WORKDIR /app
COPY . .
RUN npm install --legacy-peer-deps && npm run build

FROM node:18
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/dist ./dist
CMD ["serve", "-s", "dist", "-l", "8080"]