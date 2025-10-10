import express from 'express';
import conversationRoutes from './routes/conversation.routes.js';
import adminRoutes from './routes/admin.routes.js';
import authRoutes from './routes/auth.routes.js';

/**
 * ミドルウェアを受け取り、APIのメインルーターを生成する関数
 * @param {Function} csrfProtection - CSRF保護ミドルウェア
 * @param {Function} loginLimiter - ログインレートリミットミドルウェア
 * @returns {express.Router} Expressのルーター
 */
const createApiRouter = (csrfProtection, loginLimiter) => {
    const router = express.Router();

    /**
     * チャット関連
     * CSRF保護が必要なエンドポイントを持つため、csrfProtectionを渡す
     */
    router.use('/conversation', conversationRoutes(csrfProtection));

    /**
     * 管理者関連
     * 全てのエンドポイントで認証とCSRF保護が必要になるため、両方を渡す
     */
    router.use('/admin', adminRoutes(csrfProtection));

    /**
     * 認証関連
     * loginエンドポイントでレートリミットが必要なため、loginLimiterを渡す
     * CSRF保護が不要なエンドポイントもあるため、csrfProtectionも渡して内部で判断させる
     */
    router.use('/auth', authRoutes(csrfProtection, loginLimiter));

    return router;
};

export default createApiRouter;