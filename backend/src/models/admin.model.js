import { pool } from "../config/db.js";

/**
 * DBから会話ログを取得する
 */
export const selectAllData = async () => {
    const sql = `
        SELECT 
            m.id AS message_id,
            u.username AS username,
            c.id AS conversation_id,
            m.sender_type,
            m.content,
            m.sent_at
        FROM
            messages AS m
            LEFT JOIN conversations AS c ON m.conversation_id = c.id
            LEFT JOIN users AS u ON c.user_id = u.id
        WHERE
            m.id > $1
        ORDER BY
            m.sent_at
        LIMIT
            $2;
    `;
    const result = await pool.query(sql);
    return result.rows;
}