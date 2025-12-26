# シーケンス図

このドキュメントでは、システムの主要な機能がどのような順序で、どのコンポーネント間で連携して動作するかを定義します。

## 1. メッセージ送受信シーケンス

ユーザーがチャット画面でメッセージを送信し、LLMからの応答が画面に表示されるまでの一連の流れ。

```mermaid
sequenceDiagram
    participant Client as HTML/CSS/JS Client
    participant Nginx
    participant Node as Node.js API Server
    participant DB as PostgreSQL DB
    participant LLM as LLM Engine

    Note over Client: ユーザーがメッセージを入力し、送信ボタンを押す

    Client->>+Nginx: POST /api/conversations/{id}/messages
    Nginx->>+Node: (Request Forward)

    Node->>+DB: INSERT into messages (ユーザーのメッセージを保存)
    DB-->>-Node: 保存成功

    Node->>+DB: SELECT messages from conversations (LLMに渡す文脈を取得)
    DB-->>-Node: 会話履歴を返す

    Node->>+LLM: プロンプトをAPIで送信 (会話履歴を含む)
    note right of LLM: プロンプトに基づき応答を生成
    LLM-->>-Node: 生成した応答テキストを返す

    Node->>+DB: INSERT into messages (LLMの応答を保存)
    DB-->>-Node: 保存成功

    Node-->>-Nginx: LLMの応答をJSONで返す
    Nginx-->>-Client: (Response Forward)

    Note over Client: 新しいメッセージを画面に表示
```

## 2. シーケンスの解説

    ユーザー操作: ユーザーがブラウザ（Client）でメッセージを送信します。

    APIリクエスト: Clientは、Nginx経由でNode.js APIサーバーにPOSTリクエストを送信します。

    ユーザーメッセージ保存: Node.jsサーバーは、受け取ったメッセージをまずPostgreSQL DBに保存します。

    コンテキスト取得: 次に、LLMに渡すための過去の会話履歴（コンテキスト）をDBから取得します。

    LLMへの問い合わせ: Node.jsサーバーは、取得した会話履歴と新しいメッセージを添えて、LLM Engineに推論リクエストを送ります。

    LLM応答保存: LLMから応答が返ってくると、Node.jsサーバーはその内容もDBに保存します。

    APIレスポンス: 最後に、Node.jsサーバーはLLMの応答をClientに返します。

    画面表示: Clientは受け取った応答メッセージをチャット画面に描画します。