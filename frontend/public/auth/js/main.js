import * as ui from './ui.js';
import * as api from './api.js';

document.addEventListener('DOMContentLoaded', () => {
    // ログインボタンのHTMLButtonElementを取得
    const loginBtn = ui.getLoginButton();
    // ボタンの存在をチェック
    if (!loginBtn) return;
    // ログインボタンを押した際
    loginBtn.addEventListener('submit', async (e) => {
        e.preventDefault();
        // メアドとパスワードを取得
        const { email, password } = ui.getLoginData();
        // 開発用：取得情報を確認
        console.log('ログイン情報: ', email, ' : ', password);
        // データベースに確認
        const res = api.checkUserData(email, password);
        // 結果確認
        if (res.success) {
            // チャット画面に遷移
            ui.goMainPage();
        }

    })


})