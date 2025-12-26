FROM nginx:stable-alpine

# 静的ファイルを配信ディレクトリにコピー
COPY ./public/ /usr/share/nginx/html

# Nginxの設定ファイルと証明書
COPY ./nginx/nginx_http.conf /etc/nginx/nginx_http.conf
COPY ./nginx/nginx_https.conf /etc/nginx/nginx_https.conf
COPY ./nginx/certs /etc/nginx/certs

COPY ./nginx/entrypoint.sh /docker-entrypoint.d/entrypoint.sh
RUN chmod +x /docker-entrypoint.d/entrypoint.sh

RUN rm /etc/nginx/conf.d/default.conf