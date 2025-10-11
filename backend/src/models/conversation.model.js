import { pid } from "process";
import { pool } from "../config/db.js";

// newConversation.controllers.js startNewConversation用
export const newConversation = async (userId, title) => {
    // conversationsテーブルに会話を作成
    const sql = 'INSERT INTO conversations (user_id, title) VALUES ($1, $2) RETURNING *';
    const result = await pool.query(sql, [userId, title]);
    return result.rows[0];
};

