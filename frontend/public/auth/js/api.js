/**
 * ログイン情報がDBと一致するか確認
 * @param {string} email : ユーザーのメールアドレス
 * @param {string} password: パスワード
 * @returns {Object} 
 */
export async function checkUserData(email, password) {
    const response = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'mailAddress': email,
            'password': password
        })
    });

    const data = await response.json();

    return data;
}