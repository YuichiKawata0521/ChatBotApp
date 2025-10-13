import { body, validationResult } from 'express-validator';

export const validateRegistration = [
    // 1. ルールを配列として定義
    body('mailAddress').isEmail().wihMessage('有効なメールアドレスを入力してください。'),
    body('password').isLength({ min: 8 }).withMessage('パスワードは8文字以上で設定してください'),

    // 2. バリデーション結果をチェックするミドルウェア
    (req, res, next) => {
        const errors = validateResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// ログイン時のバリデーションルール
export const validateLogin = [
    body('mailAddress').isEmail().withMessage('有効なメールアドレスを入力してください。'),
    body('password').notEmpty().withMessage('パスワードを入力してください。'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];