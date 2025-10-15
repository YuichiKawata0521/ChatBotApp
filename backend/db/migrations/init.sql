-- パスワードのハッシュ化(argon2)で必要になる拡張機能を有効化
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ユーザーテーブル
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    mailaddress VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'user',
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
-- 管理者のマスターデータを登録(後で)


-- 会話管理テーブル
CREATE TABLE IF NOT EXISTS conversations (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    show_history BOOL NOT NULL DEFAULT 'true'
);

-- メッセージ管理テーブル
CREATE TABLE IF NOT EXISTS messages (
    id BIGSERIAL PRIMARY KEY,
    conversation_id BIGINT NOT NULL REFERENCES conversations(id),
    sender_type VARCHAR(10) NOT NULL,
    content TEXT NOT NULL,
    model_name VARCHAR(255),
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 管理ログ
CREATE TABLE IF NOT EXISTS operation_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    action_type VARCHAR(255) NOT NULL,
    details TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- セッションストア
CREATE TABLE IF NOT EXISTS "session" (
  "sid" varchar NOT NULL COLLATE "C",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL,
  CONSTRAINT "session_pkey" PRIMARY KEY ("sid")
);
CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "session" ("expire");