import * as ConversationModel from '../models/conversation.model.js'


/**
 * conversation.routes.js 1-5 新しい会話を始める
 */

export const startNewConversation = async (req, res, next) => {
    try {
        const { userId } = req.session.user; // userIdをリクエストに含めてもらう
        const newConversation = await ConversationModel.newConversation(userId, '新しい会話');
        res.status(201).json(newConversation);
    } catch (error) {
        next(error);
    }
};