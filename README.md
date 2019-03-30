# eonext_account
Eve Online Account Frontend

# 設定
cp .env.template .env

# .env編集
CLIENT_ID, SECRETを埋める

# 初期設定
docker-compose build
docker-compose run app yarn install

# 実行
docker-compose up

# 確認
http://localhost:4000
