# osta-ranking-proxy

IOF Ranking APIのCORSプロキシ + 週次ランキング蓄積 Cloudflare Worker。

## セットアップ

```bash
cd osta-worker

# 1. KV namespace作成
npx wrangler kv namespace create RANKING_STORE
# 出力されたidをwrangler.tomlに反映

# 2. デプロイ
npx wrangler deploy

# 3. Cron Triggerの確認
npx wrangler triggers list
```

## エンドポイント

### GET /api/ranking
IOF Ranking APIへのCORSプロキシ。パラメータをそのまま転送。

| パラメータ | 説明 | 例 |
|-----------|------|-----|
| discipline | F (FootO) or FS (Sprint) | F |
| group | MEN or WOMEN | MEN |
| date | 基準日 YYYY-MM-DD | 2026-03-01 |
| limit | 取得件数 (default: 10000) | 100 |

### GET /api/cached
KVに蓄積済みのデータを返す。パラメータは `/api/ranking` と同じ。データがなければ404。

### GET /api/dates
蓄積済みの日付一覧を返す。`?prefix=iof_` でフィルタ可能。

## Cron Trigger
毎週月曜 09:00 UTC（18:00 JST）に以下4パターンを自動取得してKVに保存:
- FootO Men / Women
- Sprint Men / Women

KVキー形式: `iof_{discipline}_{M|W}_{YYYY-MM-DD}`
