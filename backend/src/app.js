import express from 'express';
import cors from 'cors';
import session from 'express-session';
import pgSession from 'connect-pg-simple';
import csurf from 'csurf';
import rateLimit from 'express-rate-limit';
import fs from 'fs';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

import indexRoutes from './api/index.js';
import pageRoutes from './api/routes/pages.routes.js';


// --- appを生成するファクトリ関数---

// DB接続を外部から受け取る
export const createApp = (pool) => {
    const app = express();

  // --- 基本的なセキュリティ設定 ---
    app.use(helmet()); // 一般的な脆弱性からの保護

    // リバースプロキシを信頼する設定
    app.set('trust proxy', 1);

  // --- CORS設定 ---
    const corsOptions = {
        origin: process.env.CORS_ORIGIN || 'http://localhost',
        credentials: true, // cookieや認証情報送信を許可
        methods: ['GET', 'POST', 'PUT', 'DELETE'], // 許可するHTTPメソッド
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-CSRF-Token'],
        optionsSuccessStatus: 200
    };
    app.use(cors(corsOptions));

  // --- リクエストパーサー ---
    // リクエストボディをパースして、自動でreq.bodyにセット
    app.use(express.json());
    // Cookieをパースして、リクエストで使えるようにする
    app.use(cookieParser()); // ログイン状態の判定やCSRFトークンの検証などでcookieの読み取りが必要
    // フォーム送信のデータもパース。extended: trueはネストされたオブジェクトも対応
    app.use(express.urlencoded({ extended: true }));

  // --- セッション管理 ---
    // PSQLストア用のクラスを作成
    const PgSession = pgSession(session);
    // セッション情報の保存先をPSQLに設定
    const sessionStore = new PgSession({
        pool: pool,
        tableName: 'session',
        createTableIfMissing: true
    });

    // セッション暗号化に使う秘密鍵の読み込み
    let sessionSecret;
    try {
        sessionSecret = fs.readFileSync('/run/secrets/session_secret', 'utf-8').trim();
    } catch (error) {
        console.warn('Docker Secret "session_secret" を読み込めませんでした。デフォルト値を使用します。', error.message);
        sessionSecret = process.env.SESSION_SECRET || 'your_secret_key_for development_fallback';
    }


    // Expressにセッション管理をセットアップ
    app.use(session({
        store: sessionStore,
        secret: sessionSecret,
        resave: false, // リクエストがあっても、セッション情報が更新されていなければDBに保存しなおさない
        saveUninitialized: false, // 未使用セッションを保存しない
        cookie: {
            maxAge: 1000 * 60 * 60 * 8, // 8時間
            httpOnly: true, // ブラウザ上のスクリプトからクッキーを読み取れなくする(XSS対策)
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax' // リンククリック時、一部の安全なCSRでCookiを送るが、POSTなどでは送らない
        }
    }));
  // --- レートリミット設定 ---
    const loginLimitter = rateLimit({
        windowMs: 15 * 60 * 1000,
        max: process.env.NODE_ENV === 'production' ? 10 : 1000,
        message: 'ログインの試行回数が上限に達しました。15分後に再度お試しください。',
        standardHeaders: true, // RateLimit-Limit, RateLimit-Remaining, RateLimit-Reset　ヘッダーを返す
        legacyHeaders: false, // X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset　ヘッダーを無効化
    });

  // --- CSRF設定 ---
    // CSRF対策用ミドルウェア
    const csrfProtection = csurf({ cookie: true }); // CSRFトークンをCookie経由で管理

  // --- ルーティング ---

    // CSRFトークン取得用エンドポイント
    app.get('/api/v1/csrf-token', csrfProtection, (req, res) => {
        res.json({ csrfToken: req.csrfToken() });
    });

    app.use('/', pageRoutes);

    // /api/v1/以下のAPIルートにCSRF保護を適用
    // 各ルーター内部でエンドポイントに適用
    app.use('/api/v1', indexRoutes(csrfProtection, loginLimitter)); // indexRoutesにcsrfProtectionとloginLimitterを渡す

  // --- エラーハンドリング ---

    // 未定義ルートのハンドリング
    app.use((req, res, next) => {
        const error = new Error(`Not Found - ${req.originalUrl}`);
        res.status(404);
        next(error);
    });

    // CSRFエラーハンドリング
    app.use((err, req, res, next) => {
        if (err.code === 'EBADCSRFTOKEN') {
            return res.status(403).json({ success: false, message: 'CSRFトークンが無効です'});
        }

        // 開発環境：詳細エラー / 本番：一般エラー
        const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
        res.status(statusCode);

        const errorResponse  = {
            message: err.message || 'サーバーでエラーが発生しました。',
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        };

        // ログ出力
        console.error(`Error: ${err.message}`);
        if (err.stack) {
            console.error(err.stack);
        }
        res.json(errorResponse);
    });

    return app;
};
