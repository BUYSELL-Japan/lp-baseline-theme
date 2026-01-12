# SSG化完了ガイド

このプロジェクトは、ReactベースのCSRアプリケーションから、Astroを使用したSSG（Static Site Generation）アプリケーションに移行されました。

## 変更点の概要

### 以前（CSR）
- ✅ ビルド時：空のHTMLのみ生成
- ❌ データ取得：ブラウザで`useEffect`によりAPI呼び出し
- ❌ 初回表示：3-5秒のローディング時間
- ❌ SEO：検索エンジンにコンテンツが見えない
- ❌ JavaScriptなし：何も表示されない

### 現在（SSG）
- ✅ ビルド時：完全なHTMLをデータ付きで生成
- ✅ データ取得：ビルド時にサーバーサイドで実行
- ✅ 初回表示：即座に表示（ハイドレーション後にインタラクティブ）
- ✅ SEO：完全なコンテンツが検索エンジンに見える
- ✅ JavaScriptなし：基本的なコンテンツは表示される

## プロジェクト構造

```
src/
├── components/           # 既存のReactコンポーネント（変更なし）
├── contexts/            # 既存のContext（変更なし）
├── services/
│   ├── api.ts          # クライアントサイド用（開発モード用）
│   ├── buildTimeApi.ts # ビルド時専用のAPI（新規）
│   └── dataMapper.ts   # データマッピング（変更なし）
├── layouts/
│   └── Layout.astro    # Astroレイアウト（新規）
└── pages/
    └── stores/
        └── [storeId]/
            └── index.astro  # 動的ルーティング（新規）
```

## 環境変数の設定

### 開発環境（.env）

```env
# ローカル開発用設定
USE_FALLBACK_DATA=true
USE_STATIC_STORE_LIST=true
STORE_LIST=OKI1011
```

### 本番環境（CI/CD環境変数）

```env
# 本番環境用設定
USE_FALLBACK_DATA=false          # 実際のAPIから取得
USE_STATIC_STORE_LIST=false      # 動的にストアリストを取得
STORE_LIST_API_ENDPOINT=https://your-api.com/api/stores/list
```

**重要：** `USE_STATIC_STORE_LIST=false`の場合、`STORE_LIST_API_ENDPOINT`を指定してください。

## ビルドプロセス

### 開発環境

```bash
npm run dev
```

- Astro開発サーバーが起動
- ホットリロード有効
- ローカルJSONファイルを使用

### 本番ビルド

```bash
npm run build
```

1. **ストアリスト取得**
   - `USE_STATIC_STORE_LIST=true` → 環境変数`STORE_LIST`から取得
   - `USE_STATIC_STORE_LIST=false` → APIエンドポイントから取得

2. **各ストアのデータ取得**
   - `USE_FALLBACK_DATA=true` → ローカルJSONを使用
   - `USE_FALLBACK_DATA=false` → AWS API Gatewayから取得

3. **静的HTML生成**
   - `/stores/[storeId]/index.html` が生成
   - すべてのデータがHTMLに埋め込まれる

4. **出力**
   - `dist/` ディレクトリに静的ファイルが生成

## バックエンドで必要な調整

### 1. ストアリストAPIエンドポイント（必須）

**エンドポイント:** `GET /api/stores/list` または任意のパス

**レスポンス形式:**
```json
{
  "stores": ["OKI1011", "STORE002", "STORE003", ...]
}
```

**目的:** ビルド時にすべてのストアIDを取得し、各ストアのページを生成

**実装場所:**
- AWS Lambda + API Gateway
- または CloudFlare Workers

**実装例（CloudFlare Workers）:**
```javascript
export default {
  async fetch(request, env) {
    // DynamoDBからすべてのストアIDを取得
    const stores = await env.DB.getAllStoreIds();

    return new Response(JSON.stringify({ stores }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}
```

### 2. 既存のストアコンテンツAPIの調整（オプション）

**現在のエンドポイント:**
```
GET https://2sznhxhcd8.execute-api.ap-southeast-2.amazonaws.com/dev/lp/content/{storeId}
```

**必要な対応:**
- ✅ CORSヘッダーの設定（既に対応済みと思われる）
- ✅ レート制限の調整（ビルド時に複数リクエストが発生）
- ⚠️ ビルド環境からのアクセス許可（CI/CD IPアドレスの許可）

### 3. CloudFlare Workers の調整（該当する場合）

もしCloudFlare Workersを使用している場合：

```javascript
// ストアリストの取得
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)

  // ストアリスト取得
  if (url.pathname === '/api/stores/list') {
    const stores = await getStoreList()
    return new Response(JSON.stringify({ stores }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=300' // 5分キャッシュ
      }
    })
  }

  // 既存のストアコンテンツ取得
  if (url.pathname.startsWith('/api/content/')) {
    const storeId = url.pathname.split('/').pop()
    const content = await getStoreContent(storeId)
    return new Response(JSON.stringify(content), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=3600' // 1時間キャッシュ
      }
    })
  }
}
```

## デプロイ手順

### Netlify

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[[plugins]]
  package = "@astrojs/netlify"
```

### Vercel

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist"
}
```

### AWS S3 + CloudFront

```bash
npm run build
aws s3 sync dist/ s3://your-bucket-name/
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

## 再ビルドのトリガー

ストアコンテンツが更新されたら、以下の方法で再ビルドをトリガーする必要があります：

### 方法1: Webhookを使用（推奨）

1. **DynamoDBストリーム + Lambda**
   ```javascript
   // Lambda関数
   exports.handler = async (event) => {
     for (const record of event.Records) {
       if (record.eventName === 'MODIFY' || record.eventName === 'INSERT') {
         // Netlify/Vercelのビルドwebhookを呼び出し
         await fetch(process.env.BUILD_WEBHOOK_URL, {
           method: 'POST'
         });
       }
     }
   };
   ```

2. **CloudFlare Workers**
   ```javascript
   // コンテンツ更新時
   async function updateContent(storeId, content) {
     await saveToDatabase(storeId, content);

     // ビルドをトリガー
     await fetch(process.env.BUILD_WEBHOOK_URL, {
       method: 'POST'
     });
   }
   ```

### 方法2: 定期的な再ビルド

```yaml
# GitHub Actions
name: Scheduled Rebuild
on:
  schedule:
    - cron: '0 */6 * * *'  # 6時間ごと
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      - run: npm run build
      - # デプロイステップ
```

## トラブルシューティング

### ビルドが失敗する

1. **環境変数を確認**
   ```bash
   echo $USE_FALLBACK_DATA
   echo $STORE_LIST
   ```

2. **APIエンドポイントの疎通確認**
   ```bash
   curl https://your-api.com/api/stores/list
   ```

3. **ビルドログを確認**
   ```bash
   npm run build 2>&1 | tee build.log
   ```

### データが表示されない

1. **生成されたHTMLを確認**
   ```bash
   cat dist/stores/OKI1011/index.html | grep "pageData"
   ```

2. **データマッピングのログを確認**
   - ビルドログに`[mapDynamoDBDataToPageData]`が出力される

### 一部のストアのみビルドされる

1. **ストアリストAPIの確認**
   - すべてのストアIDが返されているか確認

2. **手動でストアリストを指定**
   ```env
   USE_STATIC_STORE_LIST=true
   STORE_LIST=STORE001,STORE002,STORE003
   ```

## パフォーマンス

### ビルド時間

- 1ストアあたり: 約1-2秒
- 100ストア: 約2-3分
- 1000ストア: 約20-30分

### 最適化

1. **並列ビルド** - Astroは自動的に並列処理
2. **インクリメンタルビルド** - 変更されたストアのみ再ビルド（将来の拡張）
3. **CDNキャッシュ** - CloudFrontやNetlify CDNでキャッシュ

## まとめ

このSSG化により：
- ✅ **表示速度が大幅に向上**（3-5秒 → 即座）
- ✅ **SEO対応が完璧**（すべてのコンテンツがHTML内に存在）
- ✅ **サーバーコストが削減**（静的ファイルのみ）
- ✅ **信頼性が向上**（APIダウン時も表示可能）

バックエンドでの主な作業：
1. ストアリストAPIエンドポイントの実装
2. コンテンツ更新時のビルドトリガー設定
3. CORSとレート制限の調整
