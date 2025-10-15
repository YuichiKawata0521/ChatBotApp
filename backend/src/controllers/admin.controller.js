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
        return data.rows
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

        const csvString = createCSVString(data);

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