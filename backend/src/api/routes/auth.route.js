import express from 'express';
import { protect, authorizedRoles } from '../../middleware/auth.middleware.js';

const createAuthRouter = (csrfProtection, loginLimiter) => {
    const router = express.Router();

    /**
     ** 要件定義書B-2-2 関連機能
     */
    
    // 2-3 権限管理
    // PATCH /api/v1/auth/role
    router.patch(
        '/role',
        protect,
        authorizedRoles('admin'),
        csrfProtection,
        changeRole
    );

    /**
     ** 要件定義書B-3-2 関連機能
     */
    
    // 3-1 ログイン
    // POST /api/v1/auth/login
    router.post(
        '/login',
        loginLimiter,
        userLogin
    );

    /**
     ** 要件定義書B-4-2 関連機能
     */
    
    // 4-1 新規登録
    // POST /api/v1/auth/register
    router.post(
        '/register',
        registerNewUser
    );

    return router
};

export default createAuthRouter;
