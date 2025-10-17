import * as ui from './ui.js';
import * as api from './api.js';

document.addEventListener('DOMContentLoaded', () => {
    // 新規登録画面のHTMLFormElementを取得
    const registerForm = ui.getRegisterFrom();
    // フォームの存在チェック
    if (!registerForm) return;
    // 登録するボタンを押したときの処理
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        // 登録情報を取得
        const { username, email, password } = ui.getRegisterData();
        // 開発用：取得情報を確認
        console.log('登録情報 : ', username, ' : ', email, ' : ', password);
        // データベースに登録
        const res = await api.registerUserData(username, email, password);
        // 結果確認
        if (res.success && res.message ==='登録完了') {
            console.log('新規ユーザー登録完了!');
            // ログイン画面に遷移
            ui.goLoginPage();
        } else {
            console.error(res.message);
            alert(res.message || '新規登録に失敗しました。');
        }
    });
});