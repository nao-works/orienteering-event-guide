# Oスタ / Oガイド

オリエンテーリング大会向けの公開ツール群です。

- Oスタ: JOY / Japan-O-entrY 締切後に、スタートリストを作るブラウザツール
- Oガイド: 実験的な大会情報ビューア。更新頻度は保証しません

## 公開 URL

- Oスタ: https://osta.pages.dev/
- Oガイド: https://oguide.pages.dev/

## 現在の位置づけ

この repo の主な公開ツールは Oスタです。Oスタは、単日大会の運営者が締切後に JOY CSV からスタートリストを作り、公開前チェックまで進めるための簡易ツールです。クラス別人数などの集計メモと Mulka CSV のたたき台は副産物として出力します。

大会運営の正本生成では、イベント設定、入力検査、補正履歴、出力記録を残せる運営向けフローを優先します。Oスタ単体の出力を最終 Mulka 取込の根拠にしないでください。

Oガイドは、公開済みデータの見え方を試すための実験的な情報ビューです。継続更新される大会情報サービスとしては扱わず、参加・運営判断には主催者の公式情報を確認してください。

詳しくは [docs/startlist-tooling.md](docs/startlist-tooling.md) を参照してください。

正本生成の考え方を示す匿名サンプルは [core-sample/](core-sample/) に置いています。実名の参加者データは含みません。

## ツールの役割

| ツール | 役割 | 向いている用途 |
|---|---|---|
| Oスタ | スタートリスト作成 | 単日大会のCSV確認、公開前チェック、スタートリスト下書き |
| Oガイド | 実験的な大会情報ビューア | 公開データの見え方確認。公式情報の代替にはしない |
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
- OスタCore の匿名サンプルは `core-sample/` に置きます。
- Cloudflare / Wrangler のローカルキャッシュ `.wrangler/` は repo に入れません。
