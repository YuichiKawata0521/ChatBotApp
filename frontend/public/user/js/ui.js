import { state as configState } from './config.js';

export function applyFrontText() {
    const text = configState.frontText;
    if (!text) return;

    document.querySelectorAll("[data-text]").forEach(el => {
        const key = el.dataset.text;
        if (text[key] !== undefined) {
            el.textContent = text[key];
        }
    });

    document.querySelectorAll("[data-placeholder]").forEach(el => {
        const key = el.dataset.placeholder;
        if (text[key] !== undefined) {
            el.placeholder = text[key];
        }
    });
}


/**
 * 新しい会話 ボタンを押した際の処理
 */
export function initPage() {
    initInputMessage(); // 入力エリアの初期化
    showWelcomeMessage(); // welcomeメッセージを表示

}

/**
 * 新しい会話ボタンの要素を取得
 * @returns {HTMLButtonElement}
 */
export function getNewChatBtnElement() {
    return document.getElementById('newChatBtn');
}
// ========================================================================================================
// welcome message container
// ========================================================================================================
/**
 * ロゴとメッセージを表示させる
 */
export function showWelcomeMessage() {
    const welcome = getWelcomeMessageContainerId();
    if (welcome.classList.contains('hidden')) {
        welcome.classList.remove('hidden');
    }
}
/**
 * ロゴとメッセージを非表示させる
 */
export function hideWelcomeMessage() {
    const welcome = getWelcomeMessageContainerId();
    if (!welcome.classList.contains('hidden')) {
        welcome.classList.add('hidden');
    }
}

/**
 * ロゴとメッセージのコンテナIdを取得
 * @returns {HTMLElement} ロゴとメッセージのコンテナId
 */
function getWelcomeMessageContainerId() {
    return document.getElementById('welcomeMessageContainer');
}

// ========================================================================================================
// 入力欄
// ========================================================================================================
/**
 * 入力欄を初期化(空欄化、高さ初期化)
 */
export function initInputMessage() {
    const input = getInputMessageId();
    cleanInputMessage(input);
    adjustInputArea(input);
}
/**
 * 入力欄のidを取得
 * @returns {HTMLElement} 
 */
function getInputMessageId() {
    return document.getElementById('inputMessage');
}

/**
 * 入力欄を空白にする
 * @param {HTMLElement} input 入力欄のid
 */
function cleanInputMessage(input) {
    if (input) {
        input.value = '';
    }
}

/**
 * 入力欄の高さを初期化
 * @param {HTMLElement} input 入力欄のid
 */
function adjustInputArea(input) {
    input.style.height = 'auto';
    input.style.height = `${Math.min(input.scrollHeight, 300)}px`;
}