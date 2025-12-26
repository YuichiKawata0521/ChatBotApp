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