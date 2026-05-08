# Oガイド / Oスタ

オリエンテーリング大会向けの公開ツール群です。

- Oガイド: 参加者向けの大会情報ビューア
- Oスタ: JOY / Japan-O-entrY 形式のエントリー CSV からスタートリストを生成するブラウザツール

## 公開 URL

- Oガイド: https://oguide.pages.dev/
- Oスタ: https://osta.pages.dev/

## 現在の位置づけ

Oガイド/Oスタは公開ブラウザツールです。とくに Oスタは、CSV 読取、ランダムスタートリスト生成、ランキング順の並べ替え、Mulka2 CSV 出力をブラウザ上で試すための簡易ツールです。

大会運営の正本生成では、イベント設定、入力検査、補正履歴、出力記録を残せる運営向けフローを優先します。Oスタ単体の出力を最終 Mulka 取込の根拠にしないでください。

詳しくは [docs/startlist-tooling.md](docs/startlist-tooling.md) を参照してください。

## ツールの役割

| ツール | 役割 | 向いている用途 |
|---|---|---|
| Oガイド | 参加者向けの大会情報ビューア | 公開情報の閲覧、当日の動線確認 |
| Oスタ | ブラウザ版の簡易スタートリスト生成 | 小規模な確認、下書き、ランキング順の試行 |
| 運営向け正本生成フロー | 正本生成の基準 | JOY 正規化、イベント設定、検証、生成記録、Mulka 出力 |

Oスタを運営利用する場合は、少なくとも重複カード番号、空カード、フリースタート、固定ゼッケン、複数レーン、複数日大会、入力ファイルの確定状態を別途確認してください。現在の内部実装では、この正本生成フローを CLI / core workflow として管理しています。

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
