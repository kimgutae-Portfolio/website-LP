# 訪問・LINEクリックの無料計測

GA4: `まちのWeb | machinowebs.com` / stream `まちのWeb ウェブサイト`。
公開測定IDは `analytics.config.ts` の `G-JVS5FTTQLJ`。
必要な場合のみ `NEXT_PUBLIC_GA_MEASUREMENT_ID` で上書きする（秘密鍵ではない）。

## 何を記録するか

- `page_view`: 最初の表示とApp Routerによるパス変更。ハッシュ移動では重複計測しない。
- `line_click`: 設定済みの実際の事業用LINEリンクのみ。デモの `https://line.me/` は対象外。
- `cta_location`: `hero`, `header`, `pricing_intro`, `pricing`, `contact`, `floating`, `column`, `not_found`, `cta`。
- `contact_method: line`, `page_path`, `link_url`。フォーム入力値や会話内容は送らない。
- 自動フォーム収集・スクロール・外部リンク等はGA4ストリームの拡張計測をOFFにしている。

## 同意・検証

同意前はGoogleスクリプトを読み込まない基本同意モード。許可・拒否はブラウザに90日保存。
拒否するとイベント送信を止め、Google解析Cookieを削除する。フッターから変更可能。
Google シグナル、広告パーソナライズは無効。許可時のみ解析・広告効果測定の同意を更新する。
個人情報を送る拡張コンバージョンやリマーケティングは実装しない。
既存のCookie不要のVercel Analyticsは変更しない。

通常は `machinowebs.com` / `www.machinowebs.com` のみ。localhost・Vercelプレビューは計測しない。
明示的なQA時のみ `NEXT_PUBLIC_ANALYTICS_DEBUG=true npm run dev -- --port 3001` でlocalhostから
DebugView用イベントを送る。終了後、通常の環境でビルドする。

GA4（account `413281492` / property `560546854`）の
「レポート → リアルタイム」で `page_view` / `line_click` を確認できる。
通常レポートへの反映には時間がかかる。ブラウザ拒否・広告ブロックによる欠損はある。
LINEの実際の友だち追加・会話開始はこのタグでは分からない。チャット管理で別途確認する。

## Google広告で使う前に

広告アカウントの初期・決済設定とGA4のリンクは別の作業。未完了の状態で広告計測完了とは扱わない。
広告キャンペーンの最終URLはホームページにする（LINEへ直接飛ばさない）。
自動タグ設定を有効にし、このGA4の `line_click` をインポートする場合は **補助コンバージョン** として扱う。
クリックを実際の問い合わせ・売上とみなしたり、広告の最適化をクリックだけで行ったりしない。
同じイベントをGoogle広告タグとGA4インポートの両方で二重登録しない。
実際の相談人数・見積依頼・成約数は別に記録し、問い合わせ単価を比較する。

## 参考

- https://developers.google.com/analytics/devguides/collection/ga4/views
- https://developers.google.com/tag-platform/security/guides/consent
- https://support.google.com/google-ads/answer/11461796
