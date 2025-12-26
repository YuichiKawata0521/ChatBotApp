FROM node:lts-alpine3.21

WORKDIR /app

# package.json と package-lock.json をコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm install

# 残りのファイルをコピー
COPY . .

# ポートを公開
EXPOSE 3000

# 実行コマンド
CMD [ "npm", "run", "dev" ]
