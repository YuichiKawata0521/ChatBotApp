
export async function getFrontText() {
    const url = '/user/text/text.front.json';
    let response;
    try {
        response = await fetch(url);
    } catch (networkError) {
        console.error(`Fetch API failed for ${url}: ${networkError}`);
        throw new Error(`ネットワークエラーによりファイルが取得できませんでした: ${networkError.message}`);
    }

    if (!response.ok) {
        const errorDetail = `HTTPステータスコード: ${response.status} (${response.statusText})`;
        console.error(`ファイルのロードに失敗しました (${url}): ${errorDetail}`);
        throw new Error(`ファイルのロードに失敗しました: ${errorDetail}`);
    }

    try {
        return await response.json();
    } catch (parseError) {
        console.error(`JSON パースエラー (${url}): ${parseError}`);
        throw new Error(`ファイルの形式が不正です(JSONパースエラー): ${parseError.message}`);
    }
}

/**
 * メッセージを送信する(1-1)
 */
export async function sendMessage(conversationId, message) {
    const url = `/api/v1/conversations/${conversationId}/messages`
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message })
    });
    return await response.json();
}

/**
 * サーバー側で新しい会話（conversationsテーブルのレコード）を作成する
 * @returns {Promise<object>} { success: true, newConversationId: { id, title, ... } }
 */
export async function startNewConversation() {
    const url = '/api/v1/conversations';
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    if (!response.ok) {
        throw new Error('新しい会話の開始に失敗しました');
    }
    return await response.json();
}