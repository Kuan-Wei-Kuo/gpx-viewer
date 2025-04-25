# 1. 建立階段：建置 Vue 應用
FROM node:20-alpine AS build-stage

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# 2. 部署階段：使用 Nginx 提供服務
FROM nginx:stable-alpine AS production-stage

# 移除預設設定
RUN rm -rf /usr/share/nginx/html/*

# 複製建置後的檔案到 nginx 靜態目錄
RUN mkdir -p /usr/share/nginx/html/gpx-viewer
COPY --from=build-stage /app/dist/ /usr/share/nginx/html/gpx-viewer/


# 複製自定義的 nginx 設定（可選）
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
