import * as ConversationModel from '../models/conversation.model.js';

/**
 * カスタムエラーオブジェクト
 */

class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOptional = true,
        Error.captureStackTrace(this, this.constructor)
    }
}

/**
 * 認証済みユーザーのみアクセスを許可するミドルウェア
 * req.session.userにユーザー情報があれば認証済みと判定
 */

export const protect = (req, res, next) => {
    if (req.session.user) {
        next(); // 認証OK
    } else {
        next(new AppError('認証が必要です。', 401));
    }
};

/**
 * 指定されたロールを持つユーザーのみアクセス許可するミドルウェア
 * @param {...string} roles - アクセスを許可するロールリスト
 * 実際のルーターで許可したいrolesを引数で渡すだけで、そのルートはそのロールしかアクセスできなくなる
 */
export const authorizedRoles = (...roles) => { // (...roles) とすることで、引数が個数に関わらず、全てrolesという名前の配列に入る
    return (req, res, next) => {
        // protectで認証確認前提
        const userRole = req.session.user.role;

        // ユーザーのロールが許可されたリストに入っているか確認
        if (!roles.includes(userRole)) {
            return next(new AppError('アクセス権限がありません。', 403));
        }

        // 認証済みかつ適切なロール
        next();
    };
};

/**
 * 会話の所有権を確認するミドルウェア
 */
export const checkConversationOwnership = async (req, res, next) => {
    try {
        const { id: conversationId } = req.params;
        const userId = req.session.user.id;

        // DBから会話情報を取得
        const conversation = await ConversationModel.findById(conversationId);
        if (!conversationId) {
            return next(new AppError('指定された会話が見つかりません', 404));
        }

        if (conversation.user_id != userId) {
            return next(new AppError('この会話にアクセスする権限がありません', 403));
        }
        next();
     } catch (error) {
        next(error);
     }
};