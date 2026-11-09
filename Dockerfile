# 一键启动（请在 Car-Rental-web 目录执行）：
#   docker compose up --build -d
# 访问：http://localhost:8080  （演示账号 admin / admin123）
# 停止：docker compose down

# ---------- Stage 1: build the Vite client ----------
FROM node:22-slim AS client-builder
WORKDIR /app/client
RUN npm config set registry https://registry.npmmirror.com
COPY client/package*.json ./
RUN npm ci || npm install
COPY client/ ./
RUN npm run build

# ---------- Stage 2: run the Express API ----------
FROM node:22-slim
WORKDIR /app

RUN npm config set registry https://registry.npmmirror.com
COPY server/package*.json ./server/
RUN cd server && (npm ci --omit=dev || npm install --omit=dev)

COPY server/ ./server/
COPY --from=client-builder /app/client/dist ./client/dist

ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

WORKDIR /app/server
CMD ["node", "src/server.js"]
