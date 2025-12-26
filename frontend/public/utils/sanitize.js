// エスケープ用関数
export function escapeHTML(str) {
    return str.replace(/[&<>"']/g, (match) => {
        const map = {
            '&': '&amp;',
            '<':'&lt;',
            '>':'&gt;',
            '"':'&quot;',
            "'":'&#39;',
        };
        return map[match]
    });
}

// サニタイズ関数
export function sanitizeText(text) {
    return DOMPurify.sanitize(text);
}