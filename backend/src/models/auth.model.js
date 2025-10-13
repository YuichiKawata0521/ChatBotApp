import { pool } from "../config/db.js";


/**
 * 特定のuserIdのroleを変更
 * @param {number} userId
 */
export const updateRole = async (userId, role) => {
    const sql = `
        UPDATE users
        SET role = $1
        WHERE id = $2;
    `;
    const result = await pool.query(sql, [userId, role]);
    return result.rows[0];
};

/**
 * 新規登録
 */
export const insertNewUser = async (mailAddress, passwordHash, userName) => {
    const sql = `
        INSERT INTO users (username, mailaddress, password_hash, role)
        VALUES ($1, $2, $3, 'user');
    `
    const result = await pool.query(sql, [userName, mailAddress, passwordHash]);
    return result.rows[0];
};