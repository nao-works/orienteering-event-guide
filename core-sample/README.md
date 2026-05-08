# OスタCore 匿名サンプル

このフォルダは、公開用に匿名化したスタートリスト正本生成 workflow のサンプルです。

OスタLite はブラウザで使う簡易下書きツールです。一方で、この Core workflow は大会運営の正本生成で必要になる入力検査、イベント設定、補正履歴、日別出力、Mulka CSV、生成記録を扱います。

## ファイル構成

| path | 役割 |
|---|---|
| `input/joy-entrylist-anonymous.tsv` | JOY 管理画面の Excel 用 TSV を模した匿名入力 |
| `config/sample-2days.yaml` | 日別、レーン、フリースタート、固定ゼッケン、補正、スタート希望の設定 |
| `output/canonical_entries.csv` | JOY 入力を日別出走候補へ正規化した中間表 |
| `output/startlist_day1.csv` / `output/startlist_day2.csv` | 公開確認用 CSV |
| `output/startlist_day1.md` / `output/startlist_day2.md` | 人間が確認しやすい Markdown |
| `output/mulka_day1.csv` / `output/mulka_day2.csv` | Mulka 取込前提の CSV |
| `output/manifest.json` | 入力、設定、出力、件数、警告の生成記録 |

## このサンプルで見せること

- 2日間大会を Day1 / Day2 に分けて出力する
- Lane 1 / Lane 2 で別々にスタート時刻を進める
- ライト系クラスをフリースタートとして扱う
- 2日間で同じ人・同じチームに固定ゼッケンを維持する
- グループ内の1名だけを Day2 に別クラスへ移す補正を記録する
- 遅め/早め希望を設定として残す
- レンタルカード未割当を Mulka 取込前の警告として manifest に残す

## 実行コマンド

現在の CLI 実装はこの公開 repo にはまだ含めていません。内部の `ol-startlist` で生成したサンプル出力を同梱しています。

同じ構成を生成する場合のコマンド形は次の通りです。

```bash
python3 -m ol_startlist inspect core-sample/input/joy-entrylist-anonymous.tsv
python3 -m ol_startlist summarize core-sample/input/joy-entrylist-anonymous.tsv --config core-sample/config/sample-2days.yaml
python3 -m ol_startlist validate core-sample/input/joy-entrylist-anonymous.tsv --config core-sample/config/sample-2days.yaml
python3 -m ol_startlist build core-sample/input/joy-entrylist-anonymous.tsv --config core-sample/config/sample-2days.yaml --output-dir core-sample/output
```

## 判断

このサンプルは、OスタLite を巨大化するためのものではありません。公開ブラウザツールとは別に、正本生成に必要な core の考え方を見せるための最小例です。
