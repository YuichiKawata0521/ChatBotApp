
export async function getFrontText() {
    const url = '/user/text/text.front.json';
    let response;
    try {
        response = await fetch(url);
    } catch (networkError) {
        console.error(`Fetch API failed for ${url}: ${networkError}`);
        throw new Error(`ネットワークエラーによりファイルが取得できませんでした: ${networkError.message}`);
    }

    if (!response.ok) {
        const errorDetail = `HTTPステータスコード: ${response.status} (${response.statusText})`;
        console.error(`ファイルのロードに失敗しました (${url}): ${errorDetail}`);
        throw new Error(`ファイルのロードに失敗しました: ${errorDetail}`);
    }

    try {
        return await response.json();
    } catch (parseError) {
        console.error(`JSON パースエラー (${url}): ${parseError}`);
        throw new Error(`ファイルの形式が不正です(JSONパースエラー): ${parseError.message}`);
    }
}