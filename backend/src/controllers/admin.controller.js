import * as AdminModel from '../models/admin.model.js';
import { createCSVString } from '../utils/createCsvString.js';

/**
 * admin.routes.js 2-1 ログ取得
 */
export const getLogs = async (req, res, next) => {
    try {
        const data = await AdminModel.selectAllData();
        if (data.length === 0) {
            return res.status(404).json({success: false, message: 'データがありませんでした。'});
        }
        return res.status(200).json({success: true, message: 'データ取得完了', data: data});
    } catch (error) {
        console.error('ログ取得中にエラーが発生しました: ', error);
        res.status(500).json({success: false, message: 'ログの取得に失敗しました'});
    }
}

/**
 * admin.routes.js 2-2 ログのエクスポート
 */

export const exportLogs = async (req, res, next) => {
    try {
        const data = await AdminModel.selectAllData();
        if (data.length === 0) {
            return res.status(404).json({success: false, message: 'データがありませんでした。'});
        }

        const headers = ['ID', 'ユーザー', '会話ID', '送信者', '内容', '送信日時'];

        const csvString = createCSVString(data, headers);

        const BOM = '\uFEFF';
        const csvWithBOM = BOM + csvString;
        
        const now = new Date()
        const filename = `Chat_Logs_${now.getFullYear}_${now.getMonth}_${now.getDate}.csv`
        // レスポンスヘッダーの設定
        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}`);

        // CSVデータの送信
        res.status(200).send(csvWithBOM);
    } catch (error) {
        console.error('ログのエクスポート中にエラーが発生しました: ', error);
        res.status(500).json({success: false, message: 'ログのエクスポートに失敗しました'});
    }
}