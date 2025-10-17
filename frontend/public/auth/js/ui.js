import { escapeHTML, sanitizeText } from "../../utils/sanitize.js";

// -----------------------------------------------------------------------------------------
// ログイン画面用の関数
// -----------------------------------------------------------------------------------------

/**
 * ログインフォームの情報を返す
 * @returns {HTMLFormElement}
 */
export function getLoginForm() {
    return document.querySelector('.auth-form form');
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
    window.location.href = "/user/index.html"; // href = "/"でもよいが、可読性の為ファイルまで記載
}

// -----------------------------------------------------------------------------------------
// 新規登録画面用の関数
// -----------------------------------------------------------------------------------------

/**
 * 新規登録フォームの情報を返す
 * @returns {HTMLFormElement}
 */
export function getRegisterFrom() {
    return document.querySelector('.auth-form form');
}

/**
 * 新規登録フォームの入力値を取得する
 * @returns {Object} usernameとemailとpasswordをJSON形式で返す
 */
export function getRegisterData() {
    // ユーザー名を取得してサニタイズ
    const username = sanitizeText(document.getElementById('username').value);
    // メールアドレスを取得してサニタイズ
    const email = sanitizeText(document.getElementById('email').value);
    // パスワードを取得してサニタイズ
    const password = sanitizeText(document.getElementById('password').value);
    // JSON形式で返す
    return { username, email, password };
}

/**
 * ログイン画面への遷移
 */
export function goLoginPage() {
    window.location.href = '/auth/login.html';
}