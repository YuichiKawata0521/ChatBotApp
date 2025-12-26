#!/bin/sh

# スクリプトがエラーで停止するように設定
set -e

# デフォルトはHTTP設定を使用
CONFIG_SOURCE="/etc/nginx/nginx_http.conf"
echo "Starting with HTTP configuration..."

# HTTPS_ENABLEDが"true"の場合のみ、HTTPS設定に切り替える
if [ "$HTTPS_ENABLED" = "true" ]; then
    CONFIG_SOURCE="/etc/nginx/nginx_https.conf"
    echo "HTTPS_ENABLED is true. Switching to HTTPS configuration..."
fi

# 決定した設定ファイルをコピー
cp "$CONFIG_SOURCE" /etc/nginx/conf.d/default.conf

# Nginxのメインプロセスを起動
exec nginx -g "daemon off;"
