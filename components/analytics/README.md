# 日本限定・初回ポップアップなしのアクセス解析

2026-10-26。プライバシーポリシーでの告知とブラウザ単位のオプトアウトを提供し、
サーバーが接続国を日本と判定したアクセスだけGA4・Clarityを動かす。
「明示的な同意を取得した」とする記録は作らない。

## 読み込み条件

- `analytics.config.ts`: `cookieMeasurementEnabled: true`、GA4 `G-JVS5FTTQLJ`、Clarity `z3m9xda0mq`。
- `GET /api/measurement-region`: Vercel本番・正規ドメインだけで判定。ローカル、プレビュー、海外、国情報なし、検証不能なプロキシは不許可。
- 国判定が成功する前、通信失敗・8秒タイムアウト、別パスの判定中、オプトアウト、GPC有効時、設定保存へのアクセス失敗ではタグ・イベントを開始しない。
- ブラウザ言語・タイムゾーン・URLパラメータを国判定に使わない。APIはIP・都市・座標を保存せず返さない。
- APIは `private, no-store`、CDNも `no-store`。国別結果を他の訪問者に配信しない。
- SPAのパス変更、表示復帰、接続復帰、表示中5分ごとに再確認。非許可になれば停止。IP推定なので実所在地を保証しない。
- 本番ホスト以外は通常無効。`debugLocal: true` でもAPIは日本扱いにせず、実データは送らない。JP/海外の分岐はモックを使う単体テストで検証。

## CDN・プロキシ

通常はVercelの `x-vercel-ip-country` を利用。Cloudflareを前段に置く場合、そのままでは
VercelがCloudflareサーバーの所在地を返すため使わない。
Vercelの `x-vercel-forwarded-for` がCloudflare公式公開CIDRに含まれる場合だけ
`CF-IPCountry` を使用する。Cloudflareらしいヘッダーだけの偽装、複数IP、
不明な国、`XX`、Torの`T1`は不許可。Cloudflare経由で国ヘッダーがない場合も不許可。
CIDRは `lib/measurement-region.ts`、2026-10-26に公式IPv4/IPv6一覧を確認。
将来の範囲変更や他のプロキシを導入した際は必ず再確認する。
Cloudflare IP Geolocation設定やDNS・ネットワーク設定はこの実装では変更しない。

## 収集と制限

- GA4 `page_view`: 初回とパス変更。ハッシュ移動・地域再確認だけでは重複させない。
- `line_click`: `https://lin.ee/Ny9tbUX` の実際の事業用ボタンのみ。デモLINEは対象外。
- `contact_method: line`, `cta_location`, `page_path`, `link_url`。フォーム入力・名前・メール・LINE会話は送らない。
- URLはキャンペーン項目等の許可リストで絞り、参照URLのクエリも除去。
- Google シグナル、広告個人化、広告用ストレージ、広告用ユーザーデータはOFF。広告データ削除設定ON。拡張計測もGA4管理側でOFFのまま。
- Clarityは統計解析用ストレージだけ許可し、広告用はdenied。GCMも同じ設定なのでMicrosoft広告用の許可に広がらない。
- 入力欄の標準マスキングと問い合わせフォーム全体の `data-clarity-mask="true"` を維持。個人を識別するカスタムIDなし。
- CookieなしのVercel Web Analyticsは別に継続。Stripeの個別決済案内・LINE遷移・フォーム処理も独立。

## オプトアウト

初回には何も表示しない。フッターの「アクセス解析の設定」を押した時だけ設定ダイアログを開く。
「計測を停止する」で直ちにGoogle送信無効化、Clarityの記録停止、削除可能な解析Cookieを削除。
SDKがすでに読み込まれていても記録を止め、次のページ読み込みではタグを読み込まない。
ブラウザ内 `machinowebs:measurement-opt-out:v1` に保存し、自動期限切れなし。
旧v2の明示拒否は尊重する。古い許可は明示同意の証跡として再利用しない。
複数タブにも反映し、保存不可なら初期状態を停止にする。手動変更はそのページだけに適用。

## 広告・運用

GA4 account `413281492` / property `560546854`、専用Google広告 `777-651-0768`。
`line_click` は補助コンバージョンのままで、実際の友だち追加・会話・契約ではない。
広告用データを制限しているため、GA4でのイベント集計とGoogle広告での属性付与・
補助コンバージョンへの反映は同じではなく、反映されない場合もある。実相談件数は別途確認する。
広告予算・入札・キャンペーン・請求設定は変更しない。

検証: `npm run build` 後に `node --test scripts/test-*.mjs`。
JP/海外/不明/偽装CDN/キャッシュ/失敗/拒否・再開/再訪問/GPCをテスト。
本番では `/api/measurement-region` の判定、初回ダイアログなし、手動設定、タグ、停止後の再読み込みを確認する。
ダッシュボード受信と広告由来の実際のコンバージョンは別確認で、コード検証だけで完了扱いにしない。

## 一次資料

- https://vercel.com/docs/headers/request-headers
- https://vercel.com/kb/guide/geo-ip-headers-geolocation-vercel-functions
- https://developers.cloudflare.com/network/ip-geolocation/
- https://www.cloudflare.com/ips-v4
- https://www.cloudflare.com/ips-v6
- https://developers.google.com/tag-platform/security/concepts/consent-mode
- https://learn.microsoft.com/en-us/clarity/setup-and-installation/cookie-gcm
- https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-consent-api-v2
