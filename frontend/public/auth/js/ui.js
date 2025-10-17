import { escapeHTML, sanitizeText } from "../../utils/sanitize.js";

/**
 * ログインボタンの情報を返す
 * @returns {HTMLButtonElement}
 */
export function getLoginButton() {
    return document.querySelector('.auth-btn');
}

/**
 * ログインフォームの入力値を取得する
 * @returns {Object} emailとpasswordをJSON形式で返す
 */
export function getLoginData () {
    // メールアドレスを取得してサニタイズ
    const email = sanitizeText(document.getElementById('email').value);
    // パスワードを取得してサニタイズ
    const password = sanitizeText(document.getElementById('password').value);
    // JSON形式で返す
    return { email, password };
}

/**
 * メイン画面への遷移
 */
export function goMainPage() {
    
}