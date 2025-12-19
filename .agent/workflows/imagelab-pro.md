---
description: Image Lab Pro 開発の鉄則 - 広告・模倣対策・SEO・i18n
---

# Image Lab Pro Development Protocol

Image Lab Pro の個別ページ化にあたり、収益化の維持と独自技術の保護、SEO品質を担保するためのルール。

## 1. 収益化維持 (Ad & Analytics)
- [ ] **広告タグの挿入**: 新規ページ作成時、`src/components/ads/` 配下の広告コンポーネントが以下の箇所に含まれているか確認する。
    - ファイル選択前（メインエリア上部）
    - 処理中（ローディング画面）
    - 処理完了後（ダウンロードボタン付近）
- [ ] **計測タグ**: `SEOHead.tsx` または `App.tsx` で Google Analytics 等の計測が漏れていないか確認する。

## 2. 模倣・盗用対策 (Protection)
- [ ] **右クリック・F12制限**: 本番環境において、画像処理ロジックの解析を遅らせるため、プレビュー画面での右クリックや開発者ツールの基本的ブロックを検討する。
- [ ] **ロジックの隠蔽**: クライアントサイドの重要なAI処理コードは、ビルド時に難読化（Obfuscation）される設定になっているか確認する。
- [ ] **ウォーターマーク**: 処理後のプレビュー画像には、保存前まで薄く独自のウォーターマーク（Domain Watermark）を重ねる。

## 3. SEO & 多言語対応 (Global SEO)
- [ ] **Metadata 一致**: `src/config/seo.ts` の定義と、実際のページの `h1`, `p` タグの説明文が整合しているか。
- [ ] **i18n 完備**: `t('key')` を使用し、直接日本語/英語を JSX に書き込まない。特にツール名や説明文は必須。

## 4. UI/UX 共通規格
- [ ] **Shared UI**: `src/components/shared/` の `Slider`, `Dropzone`, `ProcessingOverlay` を使用しているか。
- [ ] **Lazy Load**: ページコンポーネントは必ず `React.lazy` で読み込む。

---

## 開発開始チェックリスト
1. [ ] `/imagelab-pro` ルールを確認したか？
2. [ ] 広告枠は確保されているか？
3. [ ] SEOメタデータは `seo.ts` に追加したか？
4. [ ] 処理ロジックは Web Worker 等で非同期化されているか？
