import express from 'express';
import { protect, authorizedRoles } from '../../middleware/auth.middleware.js';

const createAdminRouter = (csrfProtection) => {
    const router = express.Router();

    /**
     ** 要件定義書B-2-2 関連機能
     */
    
    // 2-1 ログ取得
    // GET /api/v1/admin/logs
    router.get(
        '/logs',
        protect,
        authorizedRoles('admin'),
        getLogs
    );
    
    // 2-2 エクスポート
    // GET /api/v1/admin/logs/export
    router.get(
        '/logs/export',
        protect,
        authorizedRoles('admin'),
        getLogs
    );
    
    return router;
};

export default createAdminRouter;