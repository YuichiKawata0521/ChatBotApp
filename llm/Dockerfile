FROM python:3.10-slim
WORKDIR /app

# 重いライブラリを先にインストールしてキャッシュさせる
COPY requirements-base.txt .
RUN pip install --no-cache-dir -r requirements-base.txt

# 軽いライブラリ（頻繁に変える方）を後でインストール
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
ENV PYTHONUNBUFFERED=1

CMD [ "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "5000" ]