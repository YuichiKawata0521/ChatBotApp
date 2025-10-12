import { pool } from "../config/db.js";

/**
 * 新しいメッセージをmessagesテーブルに作成する
 * @param {object} messageData - { conversationId, senderType, content, modelName? }
 * @returns {Promise<object>} 作成されたメッセージオブジェクト
 */
export const createMessage = async (messageData) => {
    const { conversationId, senderType, content, modelName = null} = messageData;

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // messageテーブルに新しいメッセージを挿入
        const messageSql = `
            INSERT INTO messages (conversation_id, sender_type, content, model_name)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;
        const messageResult = await client.query(messageSql, [conversationId, senderType, content, modelName])

        // conversationsテーブルのupdated_atを更新
        const conversationSql = `
            UPDATE conversations 
            SET updated_at = NOW()
            WHERE id = $1;
        `;
        await client.query(conversationSql, [conversationId]);

        await client.query('COMMIT');
        return messageResult.rows[0];
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

/**
 * 特定の会話IDに紐づくメッセージ履歴を取得する
 * @param {number} conversationId
 * @returns {Promise<Array>} メッセージの配列
 */
export const getMessagesByConversationId = async (conversationId) => {
    const sql = `
        SELECT sender_type, content
        FROM messages
        WHERE conversation_id = $1
        ORDER BY sent_at ASC;
    `;
    const result = await pool.query(sql, [conversationId]);
    return result.rows;
};

/**
 * 特定の会話IDを非表示にする
 * @param {number} conversationId
 */
export const updateShowHistory  = async (conversationId) => {
    const sql = `
        UPDATE conversations
        SET show_history = false
        WHERE id = $1;
    `;
    const result = await pool.query(sql, [conversationId]);
    return result.rows[0]
}

// newConversation.controllers.js startNewConversation用
export const createConversation = async (userId, title) => {
    // conversationsテーブルに会話を作成
    const sql = 'INSERT INTO conversations (user_id, title) VALUES ($1, $2) RETURNING *';
    const result = await pool.query(sql, [userId, title]);
    return result.rows[0];
};


export const findVisibleConversationsByUserId = async (userId) => {
        const sql = `
        SELECT id, title
        FROM conversations
        WHERE user_id = $1 AND show_history = true
        ORDER BY updated_at DESC;
    `;
    const result = await pool.query(sql, [userId]);
    client.release();
    return result.rows
}
