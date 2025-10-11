import { pool, checkDbConnection } from "./config/db.js";
import { createApp } from "./app.js";

const PORT = process.env.BACKEND_PORT || '3000';

const startServer = async () => {
    try {
        // DB接続確認
        await checkDbConnection();
        // 接続済みpoolを渡して、appを作成
        const app = createApp(pool);
    
        app.listen(PORT, () => {
            console.log(`サーバーが起動しました。ポート: http://localhost${PORT}`);
        });
    } catch (error) {
        console.error('サーバー起動中にエラーが発生しました: ', error.message);
        process.exit(1);
    }
};

startServer();