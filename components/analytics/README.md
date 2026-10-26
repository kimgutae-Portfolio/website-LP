# 訪問・LINEクリックの無料計測

## 現在の公開設定：同意画面なし・Cookieを用いる計測は停止

2026-10-26、初回の同意画面による離脱を避けたいという依頼に合わせ、
`analytics.config.ts` の `cookieMeasurementEnabled: false` でGoogle / Clarityを停止。
同意画面だけを隠して許可扱いにする実装ではない。

- 初回の案内とフッターの「アクセス解析の設定」を非表示。
- 過去の保存済み許可も使用せず、v1 / v2の選択を削除。削除可能なGoogle / Clarity / Google広告用の解析Cookieを期限切れにする。
- Google / Clarityタグ、ページビュー・LINEクリックのイベント、ヒートマップ・録画を読み込み／送信しない。
- Cookie不要のVercel Web Analytics、LINEへの遷移、お問い合わせフォーム、Stripeの案内は維持。
- Google広告アカウント・キャンペーン・予算は変更しない。広告クリックの課金は継続するが、サイトからGA4へ `line_click` が送信されないため新しいLINEクリックの補助コンバージョンは記録されない。
- 再開する場合は、利用目的・プライバシー表示・同意UIを再確認してからフラグを変更する。IDや環境変数を設定するだけでは再開しない。

以下は停止中の、同意取得型測定を再開する場合の仕様。

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

同意前はGoogle・Clarityスクリプトを読み込まない基本同意モード。許可・拒否はブラウザに90日保存。
Clarity追加時に同意キーをv2へ変更し、以前のGAのみの許可を流用せず再確認する。
拒否するとイベント送信とClarityのレコーダーを止め、当サイトのGoogle・Clarity解析Cookieを削除する。フッターから変更可能。
Google シグナル、広告パーソナライズは無効。許可時のみ解析・広告効果測定の同意を更新する。
個人情報を送る拡張コンバージョンやリマーケティングは実装しない。
既存のCookie不要のVercel Analyticsは変更しない。

## Microsoft Clarity

公開プロジェクトID: `z3m9xda0mq`（`analytics.config.ts`）。
許可後にだけ `https://www.clarity.ms/tag/z3m9xda0mq` を非同期でheadへ追加する。
`consentv2` は `analytics_Storage: granted` / `ad_Storage: denied`。
拒否時は `consentv2` を両方deniedにし、Cookieなしの記録も続けないよう `stop` も呼ぶ。
再許可時は同じタグを再利用して `start` する。App Routerで二重挿入しない。
入力欄の標準マスキングに加え、問い合わせフォーム全体に `data-clarity-mask="true"` を指定。
ヒートマップ・セッション再生の利用は同意案内とプライバシーポリシーに明記する。

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
