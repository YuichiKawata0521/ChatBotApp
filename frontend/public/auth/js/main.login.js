import * as ui from './ui.js';
import * as api from './api.js';

document.addEventListener('DOMContentLoaded', () => {

    // ログイン画面のHTMLFormElementを取得
    const loginForm = ui.getLoginForm();
    // フォームの存在をチェック
    if (!loginForm) return;
    // ログインボタンを押した際
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        // メアドとパスワードを取得
        const { email, password } = ui.getLoginData();
        // 開発用：取得情報を確認
        console.log('ログイン情報: ', email, ' : ', password);
        // データベースに確認
        const res = await api.checkUserData(email, password);
        // 結果確認
        if (res.success && res.message === 'ログインに成功しました。') {
            console.log('ログインに成功しました！');
            // チャット画面に遷移
            ui.goMainPage();
        } else {
            console.error(res.message);
            alert(res.message || 'ログインに失敗しました。');
        }
    });
});