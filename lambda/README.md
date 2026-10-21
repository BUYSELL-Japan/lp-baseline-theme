# lambda/

admin-ui と店舗LPのビルドが呼ぶ Lambda（リージョン ap-southeast-2）の元コード。
各フォルダの `index.mjs` は本番にデプロイ済みのコードと同じ内容（2026-10-21 に `aws lambda get-function` で取得して照合）。

| フォルダ | Lambda 関数 | 呼び出し元（API Gateway） | ランタイム | タイムアウト / メモリ | 環境変数（名前のみ） |
|---|---|---|---|---|---|
| `LP_GetContent/` | LP_GetContent | `2sznhxhcd8/dev` GET `/lp/get-content/{storeId}`、GET `/lp/content/{storeId}` | nodejs22.x | 3秒 / 128MB | なし |
| `LP_SaveContent/` | LP_SaveContent | `2sznhxhcd8/dev` POST `/lp/save-content` | nodejs22.x | 15秒 / 1024MB | `CLOUDFLARE_WEBHOOK_URL` |
| `LP_SaveImages/` | LP_SaveImages | `2sznhxhcd8/dev` POST `/lp/assets/upload-url` | nodejs24.x | 3秒 / 128MB | なし（バケット `lp-store-images` と CloudFront ドメインはコード内） |
| `LP_TranslateContent/` | LP_TranslateContent | `2sznhxhcd8/dev` POST `/lp/translate` | nodejs22.x | 60秒 / 1024MB | `OPENAI_API_KEY` |
| `LP_iframe/` | LP_iframe | `2sznhxhcd8/dev` GET `/lp/settings/{storeId}`（POST ルートは未作成） | nodejs22.x | 3秒 / 128MB | なし |
| `LP_SendContactEmail/` | LP_SendContactEmail | `t8hdhfyzn7`（HTTP API）POST `/contact` | nodejs24.x | 3秒 / 128MB | `RESEND_API_KEY`、`RESEND_FROM_EMAIL`、`LANDY_CONTACT_EMAIL` |
| `../project/LP_ListStores_Code/` | LP_ListStores | `2sznhxhcd8/dev` GET `/lp/stores` | nodejs22.x | 3秒 / 128MB | `STORES_TABLE_NAME` |
| `shared/` | — | `cognitoAuth.mjs` の原本。LP_GetContent・LP_SaveContent に同じファイルを同梱している | — | — | — |

- 現時点では、どの API Gateway ルートにもオーソライザーは付いていない。認証は各 Lambda の中で ID トークンを検証している（LP_GetContent・LP_SaveContent のみ）。
- 依存パッケージ（`@aws-sdk/*`）は Lambda ランタイムに同梱のものを使っている。
- `LP_TranslateContent` の元コードは以前 `Antigravity/translate_src/index.mjs`（Git 管理外）にあった。今後はこちらを正とする。
- `LP_iframe` は lp-registar の `lambda_src/LP_GetSettings.mjs` とほぼ同じ処理だが、本番で動いているのはこちら。`LP_GetSettings.mjs` はどの関数にもデプロイされていない。

## デプロイ

フォルダの中身を zip にして `aws lambda update-function-code` で更新する。

```sh
cd lambda/LP_SaveImages
zip -r ../LP_SaveImages.zip .
aws lambda update-function-code --region ap-southeast-2 --function-name LP_SaveImages --zip-file fileb://../LP_SaveImages.zip
```
