/**
 * CSVファイル内の特殊文字をエスケープする関数
 */
function escapeCsvValue(value) {
    if (value === null || value === undefined) {
        return '';
    }
    let stringValue = String(value);

    // CSVインジェクション対策
    if (/^[=+\-[@|%!<>]/.test(stringValue)) {
        stringValue = "'" + stringValue
    }
    // カンマ、改行、ダブルクォートが含まれている場合には、二重にして全体をダブルクォートで囲む
    if (/[,"\r\n]/.test(stringValue)) {
        stringValue = stringValue.replace(/"/g, '""');
        return `"${stringValue}"`
    }

    return stringValue
}

/**
 * DBの行データをCSV文字列に変換
 */
export function createCSVString(data, headers) {
    if (!data || !data.length === 0 || !headers) {
        return headers.map(h => escapeCsvValue(h)).join(',') + '\n'; // ヘッダーのみ
    }
    // ヘッダー行の生成
    const headerRow = headers.map(h => escapeCsvValue(h)).join(',');
    // データ行の生成
    const dataRows = data.map(row => {
        const values = headers.map(header => {
            let dbColName;
            switch (header) {
                case 'ID': dbColName = 'id'; break
                case 'ユーザー': dbColName = 'username'; break
                case '会話ID': dbColName = 'conversation_id'; break
                case '送信者': dbColName = 'sender_type'; break
                case '内容': dbColName = 'content'; break
                case '送信日時': dbColName = 'sent_at'; break
                default: dbColName = header.toLowerCase().replace(/\s/g, '_');
            }
            let value = row[dbColName];
            if (dbColName === 'sent_at' && value instanceof  Date) {
                const year = value.getFullYear();
                const month = value.getMonth() + 1;
                const day = value.getDate();
                const hour = value.getHours();
                const min = value.getMinutes();
                const seconds = value.getSeconds();
                value = `${year}年 ${month}月 ${day}日 ${hour}時 ${min}分 ${seconds}秒`
            }
            return escapeCsvValue(value)
        });
        return values.join(',');
    });
    return [headerRow, ...dataRows].join('\n');
}