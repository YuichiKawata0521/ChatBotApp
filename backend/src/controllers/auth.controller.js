import { error } from 'console';
import * as authModel from '../models/auth.model.js';
import argon2 from 'argon2';


/**
 * auth.routes.js 2-3 権限管理
 */

export const changeRole = async (req, res, next) => {
    try {
        // 必要な情報を取得
        const { id: user } = req.session.user;
        const { role } = req.body;

        await authModel.updateRole(user, role);
        res.status(200).json({sucess: true, message: `権限を${role}へ変更しました。`});
    } catch (error) {
        console.error("changeRoleでエラーが発生しました: ", error);
        next(error);
    }
}

/**
 * auth.routes.js 3-1 ログイン
 */

export const userLogin = async (req, res, next) => {
    try {
        const { mailAddress, password } = req.body;

        const user = await authModel.findUserPasswordByMailaddress(mailAddress);
        if (!user) {
            return res.status(401).json({ success: false, message: 'ユーザーが存在しません。'});
        }
        if (user.password_hash !== null || user.password_hash !== '') {
            const match = await argon2.verify(user.password_hash, password);
            if (!match) {
                return res.status(401).json({ success: false, message: "パスワードが一致しません。"});
            }
            req.session.regenerate(err => {
                if (err) {
                    console.error('セッション再生成エラー: ', err);
                    return next(error)
                }
                
                // 認証成功
                req.session.user = {
                    id: user.id,
                    role: user.role
                }

                // セッションを保存
                req.session.save(err => {
                    if (err) {
                        console.error('セッション保存エラー: ', err);
                        return next(err);
                    }

                    res.status(200).json({
                        message: 'ログインに成功しました。',
                        user: {
                            id: user.id,
                            role: user.role
                        }
                    });
                });
            });
        } else {
            return res.status(401).json({ success: false, message: '登録されていないメールアドレスです。'});
        }
    } catch (error) {
        console.error('ログインできませんでした: ', error);
        next(error);
    }
}

/**
 * auth.routes.js 4-1 新規登録
 */

export const registerNewUser = async (req, res, next) => {
    try {
        const { userName, mailAddress, password } = req.body;

        const passwordHash = await argon2.hash(password, {
            type: argon2.argon2id,
            memoryCost: 2 ** 12,
            timeCost: 3,
            parallelism: 1
        });

        const result = await authModel.insertNewUser(mailAddress, passwordHash, userName);
        res.status(200).json({ sucess: true, message: '登録完了'});
    } catch (error) {
        console.error('registerNewUserでエラーが発生: ', error);
        next(error);
    }
}