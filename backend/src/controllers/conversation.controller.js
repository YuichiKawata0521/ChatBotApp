import axios from 'axios';

import * as ConversationModel from '../models/conversation.model.js'

/**
 * conversation.routes.js 1-1 メッセ―ジ送信
 */
export const sendMessage = async (req, res, next) => {
    try {
        // 必要な情報をリクエストから取得
        const { id: conversationId } = req.params; //URLから取得
        const { message } = req.body;
        const { id: userId } = req.session.user;

        // ユーザーメッセージをmessagesテーブルに保存
        await ConversationModel.createMessage({
            conversationId: conversationId,
            senderType: 'user',
            content: message,
        });

        // LLMに渡すための会話履歴最新5件をDBから取得
        const history = await ConversationModel.getMessagesByConversationId(conversationId, 5);
        
        // LLMに渡すプロンプトを構築
        let contextText = "";
        if (history.length > 1) {
            contextText = "過去の会話履歴:\n";
            history.slice(0, -1).forEach(msg => {
                const role = msg.sender_type === 'user' ? 'user' : 'bot';
                contextText += `${role}: ${msg.content}\n`;
            });
            contextText += "\n";
        }

        const fullPrompt = `${contextText}現在の質問に対して簡潔に答えてください。\n質問: ${message}`;


        // 自作LLMにリクエストを送信
        const llmResponse = await axios.post('http://llm:5000/generate', {
            text: fullPrompt
        });

        const botReply = llmResponse.data.response; // // 仮のデータ構造
        const modelName = 'Custom-GPT2-355M-ja';

        // LLMの返信をDBに保存
        await ConversationModel.createMessage({
            conversationId: conversationId,
            senderType: 'bot',
            content: botReply,
            model_name: modelName,
        });

        // ユーザーにLLMの返信を返す
        res.status(201).json({ success: true, reply: botReply });
    } catch (error) {
        console.error('sendMessageでエラーが発生: ', error);
        if (error.code === 'ECONNREFUSED') {
            return res.status(503).json({success: false, reply: "AIサービスが一時的に停止しています"});
        }
        next(error);
    }
};

/**
 * conversation.routes.js 1-2 会話履歴取得
 * ユーザー画面の左サイドバーの履歴一覧で会話のタイトルを並べる用
 */
export const getMessages = async (req, res, next) => {
    try {
        // 必要な情報をリクエストから取得
        const { id: conversationId } = req.params; //URLから取得
        // DBから履歴を取得
        const history = await ConversationModel.getMessagesByConversationId(conversationId);
        res.status(200).json({ success: true, history: history});
    } catch (error) {
        console.error('getMessagesでエラーが発生: ', error);
        next(error);
    }
};

/**
 * conversation.routes.js 1-3 会話履歴削除(理論削除)
 */
export const hideConversationHistory = async (req, res, next) => {
    try {
        const { id: conversationId } = req.params;
        // DBのshow_historyをfalseに更新
        const deleteHistory = await ConversationModel.updateShowHistory(conversationId);
        res.status(200).json({ success: true, message: '会話履歴を削除しました'});
    } catch (error) {
        console.error('deleteConversationHistoryでエラーが発生: ', error);
        next(error);
    }
}

/**
 * conversation.routes.js 1-5 新しい会話を始める
 */

export const startNewConversation = async (req, res, next) => {
    try {
        const { id : userId } = req.session.user; 
        const newConversationId = await ConversationModel.createConversation(userId, '新しい会話');
        res.status(201).json({success: true, newConversationId: newConversationId});
    } catch (error) {
        next(error);
    }
};

/**
 * conversation.routes.js 1-7 履歴タイトル一覧取得
 */
export const getConversationList = async (req, res, next) => {
    try {
        const { id: userId } = req.session.user;
        const conversationList = await ConversationModel.findVisibleConversationsByUserId(userId);
        res.status(200).json({success: true, conversationList});
    } catch (error) {
        console.error('getConversationListでエラーが発生: ', error);
        next(error);
    }
};

