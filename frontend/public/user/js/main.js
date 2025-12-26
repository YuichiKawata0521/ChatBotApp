import * as ui from './ui.js';
import * as api from './api.js';
import { state as configState } from './config.js';

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


document.addEventListener('DOMContentLoaded', async () => {
    await getTexts(); // フロント文字列の取得
    await ui.applyFrontText(); // 取得した文字列をhtmlに適用
    startNewChatListner(); // 新しい会話ボタンのイベント
})