import { Pool } from "pg";

/**
 * PSQL Poolの設定を取得する関数
 * @returns {object} SQL接続設定オブジェクト
 */
const poolConfig ={
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST || 'db',
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
};

// プールインスタンスを一度だけ作成し、名前付きエクスポート
export const pool = new Pool(poolConfig);

/**
 * DBへ接続し、疎通確認を行う。サーバー起動前に一度だけ呼び出す予定。
 * @returns {Promise<Pool>} 接続済みのPSQL Poolインスタンス
 */
export const checkDbConnection = async () => {
    let client;

    // Poolからクライアントを取得して、疎通確認
    try {
        client = await pool.connect();
        await client.query('SELECT NOW()');
    } catch (error) {
        console.error('DB接続確認NG: ', error.message);
        process.exit(1);
    } finally {
        if (client) {
            client.release();
        }
    }
};

// アプリケーション終了時にDB接続を閉じる
process.on('SIGINT', async () => {
    if (pool) {
        await pool.end();
    }
    process.exit(0);
});