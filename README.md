# Oガイド / Oスタ

オリエンテーリング大会向けの公開ツール群です。

- Oガイド: 参加者向けの大会情報ビューア
- Oスタ: JOY / Japan-O-entrY 形式のエントリー CSV からスタートリストを生成するブラウザツール

## 公開 URL

- Oガイド: https://oguide.pages.dev/
- Oスタ: https://osta.pages.dev/

## 現在の位置づけ

Oスタは、CSV 読取、ランダムスタートリスト生成、ランキング順の並べ替え、Mulka2 CSV 出力に対応しています。

ただし、大会運営の正本生成に使う場合は、入力ファイル、生成条件、警告、出力件数を別途確認してください。特に、重複カード番号、空カード、フリースタート、固定ゼッケン、複数レーン、複数日大会はイベントごとの運用条件に合わせた確認が必要です。

## デプロイ

Cloudflare Pages:

```bash
wrangler pages deploy works/orienteering-event-guide --project-name=oguide
wrangler pages deploy works/orienteering-event-guide/osta --project-name=osta
```

Oスタのランキング API proxy:

```bash
cd works/orienteering-event-guide/osta-worker
wrangler deploy
```

## データ

- Oガイドのイベントデータは `data/` に置きます。
- Oスタのランキングキャッシュは `osta/data/` に置きます。
- Cloudflare / Wrangler のローカルキャッシュ `.wrangler/` は repo に入れません。

