import express from 'express';
import { protect } from '../../middleware/auth.middleware';
import { startNewConversation } from '../../controllers/conversation.controller.js';

const createConversationRouter = (csrfProtection) => {
    const router = express.Router();

    /**
     ** 要件定義書B-1-2 関連機能
     */
    
    // 1-1 メッセ―ジ送信
    // POST /api/v1/conversations/:id/messages
    router.post(
        '/:id/messages',
        protect,
        csrfProtection,
        sendMessage
    );

    // 1-2 会話履歴取得
    // GET /api/v1/conversations/:id/messages
    router.get(
        '/:id/messages',
        protect,
        getMessages
    );

    // 1-3 会話履歴削除(理論削除)
    // PATCH /api/v1/conversations/:id
    router.patch(
        '/:id',
        protect,
        csrfProtection,
        deleteConversationHistory
    );

    // 1-5 新しい会話を始める
    // POST /api/v1/conversations
    router.post(
        '/',
        protect, // 認証必要
        csrfProtection, // CSRF保護
        startNewConversation
    );

    return router;
};

export default createConversationRouter;