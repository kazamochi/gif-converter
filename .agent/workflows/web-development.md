---
description: Web開発の失敗しない鉄則 - AIとの協働開発ガイドライン
---

# Web Development Protocol

Webアプリケーション開発において、手戻りを防ぎ最短で高品質な成果物を出すための行動指針。

## 1. Schema First（設計優先）
// turbo
1. コードを書く前に**データ構造（Schema）を確定**させる
2. DB設計のミスは後から致命的になる
3. 機能（Function）ではなく、事象（Domain）を定義する

## 2. Complexity Control（複雑性管理）
4. **YAGNI** - 今必要ない機能は実装しない
5. **Monolith First** - 最初は単一ファイル・単一ディレクトリで始める
6. コンポーネント分割は「管理不能になった時」に行う
7. Prop Drilling（バケツリレー）を恐れない

## 3. Environment Hygiene（環境管理）
8. インポートは `@/components/...` のようなエイリアスを使用
9. 設定は `.env` に集約、ハードコード禁止
10. `npm install` だけで動く状態を維持

## 4. Prompt Engineering（AIへの指示出し）
11. ファイル全体を書き換えさせない
12. `replace_file_content` は関数・ブロック単位で適用
13. 修正前に `view_file` で最新状態を確認
14. 1コミット = 1タスクで区切る

## 5. Verification（検証）
15. 生成したUIは**必ずブラウザで確認**
16. 「データが空の時」「ロード中」「エラー時」も実装する
17. ハッピーパス（正常系）だけでなくエッジケースも確認

---

## Mission Checklist
- [ ] **Context**: 何を作るためのコードか理解しているか？
- [ ] **Safety**: この変更は他の機能を壊さないか？
- [ ] **Simplicity**: もっと単純な書き方はないか？
