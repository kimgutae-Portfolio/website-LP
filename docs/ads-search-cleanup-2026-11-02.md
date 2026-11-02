# まちのWeb — search-intent cleanup, 2026-11-02

Applied to the existing `Campaign #1` in Google Ads. Added 17 campaign-level
negative **exact matches** from the actual search terms shown in the account.
The 11 existing negatives were retained (28 total after saving). No budget,
bidding, location targeting, active positive keyword, or conversion goal changed.
Account auto-tagging was verified enabled and was not changed; this supplies the
paid-click URL parameter used by the homepage's opening bypass after deployment.

```text
[jimdo 料金]
[見やすい ホームページ デザイン]
[google サイト]
[ai で ホームページ を 作る 方法]
[スマホ だけ で ホームページ 無料]
[ホームページ 作成 アプリ 無料]
[ホームページ 完全 無料]
[ai ホームページ 作成 無料]
[ペライチ と は]
[ペライチ 料金]
[サイト を 作る 方法]
[サイト を 作る に は]
[ホームページ 制作 ソフト]
[ホームページ ビルダー]
[ジャストシステム ホームページ ビルダー 22 スタンダード アカデミック 版]
[google サイト で 作っ た ホームページ]
[web の やり方]
```

These are narrowly scoped DIY/tool-pricing/reference queries, not proof of the
individual searcher's intent. Exact exclusions avoid blocking all design, price,
free-start or tool-replacement enquiries. `費用`, `相場`, `大阪`, `関西`, `無料`,
`クリニック`, and generic tool brand names were not added as broad exclusions.

The web changes in this same task are a separate local code change: paid-landing
opening bypass and clearer consultation copy. They need deployment before they
affect the production landing page. LINE button clicks are not equated with
friend additions or actual conversations.
