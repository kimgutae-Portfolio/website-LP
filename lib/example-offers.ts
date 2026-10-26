export type ExampleOffer = {
  kind: "zero" | "custom" | "system";
  initialFrom: number | null;
  label: string;
  includedHeading: string;
  included: readonly string[];
  additional: readonly string[];
  note: string;
  breakdown?: readonly { label: string; amount: number }[];
  upgrade?: {title:string;features:readonly string[];href:string;cta:string};
};

export const exampleOffers = {
  sumitoki: {
    kind: "zero", initialFrom: 0, label: "初期0円で始められる例", includedHeading: "初期0円でできること",
    included: ["見本をベースにした1ページ・お品書き・営業案内", "写真の差し替え・手動のSNS画像掲載", "予約サイト・LINE・地図へのリンク"],
    additional: ["メニュー・店舗ごとの別ページ追加", "新しい写真・動画の制作、独自の演出", "予約管理やSNS自動連携の構築"],
    note: "既存の構成・演出を活用し、ご提供いただく写真と原稿を掲載する場合。予約サイトへのリンク設置は基本範囲です。",
  },
  sui: {
    kind: "zero", initialFrom: 0, label: "初期0円で始められる例", includedHeading: "初期0円でできること",
    included: ["見本をベースにした1ページ・メニュー・サロン案内", "ご提供写真でのスタイル紹介・既存の演出", "外部予約サイト・LINE・地図の設置"],
    additional: ["スタイリスト・店舗ごとの別ページ", "ブランドに合わせた新しい構成や演出", "撮影・動画制作、予約システムの構築"],
    note: "ヘアスタイルなど実際の写真はお客様にご用意いただきます。見本の人物画像を施術実績として掲載するものではありません。",
  },
  sekka: {
    kind: "zero", initialFrom: 0, label: "基本の会社案内は初期0円", includedHeading: "初期0円でできること",
    included: ["見本を活用した1ページの会社・技術紹介", "主要製品の概要・設備・採用情報の掲載", "電話・メール・地図への案内"],
    additional: ["製品ごとの詳細ページや資料ダウンロード", "見積依頼フォーム・図面のアップロード", "製品検索や社内システムとの連携"],
    note: "基本の紹介ページが対象です。掲載点数や資料量が多い場合、詳細ページや機能の追加を事前にご相談します。",
  },
  komorebi: {
    kind: "zero", initialFrom: 0, label: "基本の医院案内は初期0円", includedHeading: "初期0円でできること",
    included: ["見本の構成・イラストを活用した1ページ", "診療案内・診療時間・初診案内・アクセス", "医院で利用中の予約サービスへのリンク"],
    additional: ["医院専用キャラクター・新しいイラスト制作", "診療科目・医師紹介などの別ページ", "予約・問診システムとの機能連携"],
    note: "医院専用キャラクターの新規制作は含みません。実際の診療内容・時間・医師情報は、医院側でご確認いただいた原稿を掲載します。",
  },
  kasane: {
    kind: "custom", initialFrom: null, label: "ブランドに合わせる制作例", includedHeading: "基本の1ページなら初期0円",
    included: ["既存構成を活用した会社概要・事業紹介", "ご提供写真と原稿での実績紹介", "電話・メール・地図への案内"],
    additional: ["専用のオープニング・セクション移動の調整", "実績詳細・採用情報などのページ追加", "実際に送信できるお問い合わせフォーム"],
    note: "見本と同等のブランド設計・詳細構成・フォームをご希望の場合は個別お見積り。写真・文言の差し替えを中心とした基本構成なら初期0円からご相談できます。",
    upgrade:{title:"実績を、ひとつの物語に。",features:["独立したプロジェクト詳細ページ","課題・提案・素材まで伝える構成","次の事例から相談への導線"],href:"/demo/kasane/projects/workplace",cta:"プロジェクト詳細を体験"},
  },
  nagi: {
    kind: "custom", initialFrom: null, label: "宿の世界観をつくる制作例", includedHeading: "基本の1ページなら初期0円",
    included: ["既存構成を活用した宿・客室・食事の紹介", "ご提供写真の掲載・基本のアクセス案内", "ご利用中の外部予約サイトへのリンク"],
    additional: ["別ページの滞在プランナー・参考料金の計算", "客室詳細・宿に合わせた写真演出や動画制作", "予約・空室・宿泊管理システムとの連携"],
    note: "外部予約サイトへのリンクだけであれば基本範囲です。客室数・掲載量・演出・連携機能に応じて、作業前に制作費をご案内します。",
    upgrade:{title:"泊まる前に、旅を思い描く。",features:["過ごし方を選ぶ滞在プランナー","泊数に連動する参考料金","旅程の提案から外部予約へ"],href:"/demo/nagi/stay",cta:"滞在プランナーを体験"},
  },
  michiru: {
    kind: "custom", initialFrom: 55000, label: "3ページ＋お問い合わせフォーム", includedHeading: "この見本の制作範囲",
    included: ["トップ・コース／月謝・体験／お問い合わせの3ページ", "簡易コースガイド・標準フォーム・メール通知の実装", "スマートフォン対応・ページ別の検索基本設定"],
    additional: ["コースごとの詳細ページ・講師紹介ページ", "日程予約・空き枠管理・オンライン決済", "会員管理や教材配信などのシステム連携"],
    note: "この3ページ＋標準フォーム構成は初期0円の対象外です。表示額は見本の構成を活用する場合の目安。見本のフォームは操作体験のみで送信しません。実制作では送信機能を実装します。",
    breakdown: [{ label: "下層2ページの制作", amount: 33000 }, { label: "標準お問い合わせフォーム・メール通知", amount: 22000 }],
    upgrade:{title:"迷う保護者に、選ぶ入口を。",features:["学年・経験・希望でコース案内","選んだコースを引き継いで相談","独立ページの確認・完了フォーム"],href:"/demo/michiru/courses#michiru-course-guide",cta:"コース選びを体験"},
  },
  niwato: {
    kind: "system", initialFrom: null, label: "月額申込・決済の構築例", includedHeading: "紹介だけなら初期0円",
    included: ["見本をベースにしたサービス紹介1ページ", "作業内容・料金表・対応エリア・よくある質問", "LINE・外部の申込／決済ページへのリンク"],
    additional: ["実際の月額申込・Stripe定期決済との連携", "料金計算や申込条件の個別設計", "顧客・請求・解約管理の構築"],
    note: "現在の見本の決済はシミュレーションです。実際の申込・請求・解約機能は個別見積り。外部サービス利用料・決済手数料は制作費と別に必要です。",
    upgrade:{title:"申し込んだ後の体験まで。",features:["訪問予定・作業記録のマイページ","月額プラン変更と明細の表示","日程変更・休止／再開の操作見本"],href:"/demo/niwato/member",cta:"マイページを体験"},
  },
} as const satisfies Record<string, ExampleOffer>;

export type ExampleSlug = keyof typeof exampleOffers;
export const formatInitialPrice = (offer: ExampleOffer) => offer.initialFrom === null ? "個別お見積り" : `${offer.initialFrom.toLocaleString("ja-JP")}円${offer.initialFrom > 0 ? "〜" : ""}`;
