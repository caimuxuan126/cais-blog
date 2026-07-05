# ===== 后端 Dockerfile =====
FROM node:20-alpine

WORKDIR /app

# 先复制依赖清单，利用 Docker 缓存
COPY package*.json ./
RUN npm install

# 复制源代码
COPY . .

# 确保数据目录存在
RUN mkdir -p /app/data

EXPOSE 3001

CMD ["npm", "start"]
