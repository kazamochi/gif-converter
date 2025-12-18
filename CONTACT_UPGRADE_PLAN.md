# お問い合わせ機能の強化と多言語化 (Phase 11)

## 現状の課題
- `Contact.tsx` が英語でハードコードされており、サイト全体の多言語対応から浮いている。
- 送信ボタンを押すと `mailto:` が起動する「クライアント依存」の仕様になっており、利便性と信頼性に欠ける。

## 解決策
- **バックエンド**: Firebase Cloud Functions に `submitContact` を追加し、お問い合わせ内容を Firestore の `contacts` コレクションに保存する。
- **フロントエンド**:
    - `i18next` を使用してフォームのラベル、プレースホルダー、メッセージを多言語化。
    - `mailto:` ではなく、Cloud Functions を呼び出してサーバーサイドで処理を完結させる。
    - ローディング状態やエラーハンドリングを適切に行う。

## 変更予定ファイル

### フロントエンド
- `[NEW]` [contact.json (JA)](file:///f:/webbusiness/gif-converter/src/locales/ja/contact.json)
- `[NEW]` [contact.json (EN)](file:///f:/webbusiness/gif-converter/src/locales/en/contact.json)
- `[MODIFY]` [Contact.tsx](file:///f:/webbusiness/gif-converter/src/pages/Contact.tsx)

### バックエンド
- `[MODIFY]` [index.ts (Functions)](file:///f:/webbusiness/gif-converter/functions/src/index.ts)

## 検証プラン
- 日本語/英語でフォームが正しく表示されるか確認。
- 送信時に Firestore にデータが保存されるか確認。
- エミュレータおよび本番環境での動作確認。
