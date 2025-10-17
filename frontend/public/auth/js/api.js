/**
 * ログイン情報がDBと一致するか確認
 * @param {string} email : ユーザーのメールアドレス
 * @param {string} password: パスワード
 * @returns {Object} Json形式でsuccessとmessageを返す
 */
export async function checkUserData(email, password) {
    try{
        const response = await fetch('/api/v1/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'mailAddress': email,
                'password': password
            }),
            credentials: 'include' // この設定を書くことで、Cookieが送受信される
        });
        return await response.json();
    } catch (error) {
        console.error('checkUserDataでAPIエラーが発生: ', error);
        return {success: false, message: 'サーバーとの通信に失敗しました。'};
    }
}

/**
 * 登録情報をDBへ登録
 * @param {string} username: ユーザー名
 * @param {string} email : ユーザーのメールアドレス
 * @param {string} password: パスワード
 * @returns {Object} Json形式でsuccessとmessageを返す
 */

export async function registerUserData(username, email, password) {
    try {
        const response = await fetch('/api/v1/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: json.stringify({
                userName: username,
                emailAddress: email,
                password: password
            }),
        });
        return await response.json();
    } catch (error) {
        console.error('registerUserDataでAPIエラーが発生: ', error);
        return {success: false, message: 'サーバーとの通信に失敗しました。'};
    }
}