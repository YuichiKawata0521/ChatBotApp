import * as ui from './ui.js';
import * as api from './api.js';
import { state as configState } from './config.js';

let currentConversationId = new URLSearchParams(window.location.search).get('id');

async function getTexts() {
    configState.frontText = await api.getFrontText();
}

// 新しい会話ボタンを押した際の処理
function startNewChat() {
    console.log('startNewChatをよびだしました');
    ui.initPage(); // 初期画面を表示
}
// 新しい会話ボタンを押した際のイベント
function startNewChatListner() {
    const newChatBtn = ui.getNewChatBtnElement();
    if (newChatBtn) {
        newChatBtn.addEventListener('click', startNewChat);
    } else {
        console.error('Element with ID newChatBtn not found');
    }
}

// メッセージ送信時の処理
async function sendMessage() {
    const messageInput = ui.getInputMessageId();
    const sendButton = ui.getSendBtnId();

    const message = messageInput.value.trim();
    if (!message) return;

    try {
        // 連打無効化
        messageInput.value = '';
        sendButton.disable = true;

        // 新規会話の場合
        if (!currentConversationId) {
            const res = await api.startNewConversation();
            currentConversationId = res.newConversationId;

            // URLを更新
            const newUrl = `${window.location.pathname}?id=${currentConversationId}`;
            window.history.replaceState(null, '', newUrl);
        }

        // ユーザーメッセージを描画
        renderMessage('user', message);

        // バックエンドへ送信
        const response = await api.sendMessage(currentConversationId, message);

        renderMessage('bot', response.reply);
    } catch (error) {
        console.error('送信エラー', error.message);
    } finally {
        sendButton.disabq = false;
    }
}


document.addEventListener('DOMContentLoaded', async () => {
    await getTexts(); // フロント文字列の取得
    await ui.applyFrontText(); // 取得した文字列をhtmlに適用
    startNewChatListner(); // 新しい会話ボタンのイベント
})