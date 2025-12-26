import { pool } from "../config/db.js";

// ページネーション対応のログ取得
export const selectDataWithLimit = async (limit, offset) => {
    const sql = `
        SELECT
            m.id AS message_id,
            u.username AS username,
            c.id AS conversation_id,
            m.sender_type,
            m.content,
            m.sent_at
        FROM messages AS m
        LEFT JOIN conversations AS c ON m.conversation_id = c.id
        LEFT JOIN users AS u ON c.user_id = u.id
        ORDER BY m.sent_at DESC
        LIMIT $1 OFFSET $2;
    `;
    const result = await pool.query(sql, [limit, offset]);
    return result.rows;
};

// 全件取得（エクスポート用）
export const selectAllData = async () => {
    const sql = `
        SELECT
            m.id AS message_id,
            u.username AS username,
            c.id AS conversation_id,
            m.sender_type,
            m.content,
            m.sent_at
        FROM messages AS m
        LEFT JOIN conversations AS c ON m.conversation_id = c.id
        LEFT JOIN users AS u ON c.user_id = u.id
        ORDER BY m.sent_at ASC;
    `;
    const result = await pool.query(sql);
    return result.rows;
};