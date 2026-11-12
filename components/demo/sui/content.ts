export const salon = {
  name: "sui hair atelier",
  area: "大阪府堺市（デモ設定）",
  reservationUrl: "https://beauty.hotpepper.jp/",
  lineUrl: "https://line.me/",
  hours: "平日 10:00–19:00 / 土日祝 9:30–18:00",
  closed: "月曜日・第2火曜日（デモ設定）",
  linkNote: "デモでは予約サービス・LINEのトップページが開きます。実際の店舗のURLに差し替えてご利用ください。",
};

export const menuGroups = [
  { id: "cut-color", label: "カット・カラー", english: "CUT & COLOR", items: [
    { id: "design-cut", name: "デザインカット", detail: "シャンプー・ブロー込み", price: "5,500" },
    { id: "cut-and-color", name: "カット + カラー", detail: "色味や髪の状態に合わせてご相談", price: "12,100〜" },
    { id: "design-color", name: "カット + デザインカラー", detail: "ハイライト・ブリーチなどは別途ご相談", price: "17,600〜" },
  ] },
  { id: "perm-care", label: "パーマ・ケア", english: "PERM & CARE", items: [
    { id: "perm", name: "カット + パーマ", detail: "なりたい質感と、お手入れに合わせて", price: "13,200〜" },
    { id: "straight", name: "カット + ストレート", detail: "髪の状態・長さによりご案内", price: "19,800〜" },
    { id: "treatment", name: "トリートメント", detail: "他メニューへの追加料金の表示例", price: "3,300〜" },
    { id: "spa", name: "ヘッドスパ", detail: "他メニューへの追加料金の表示例", price: "3,300" },
  ] },
] as const;

export const menuGuide = [
  { id: "morning", label: "CUT", concern: "朝のセットを楽にしたい", description: "朝にかけられる時間や、乾かすだけで気になるところをお聞きします。生えぐせや毛先の動きに合わせて、長さと重さの残し方をご相談ください。", group: "cut-color", item: "design-cut" },
  { id: "color", label: "COLOR", concern: "自分に似合う色がわからない", description: "いつもの服や仕事での明るさの目安、これまでのカラー履歴を確認します。色が抜けていく過程や次に染める時期も含めて、無理のない色を考えます。", group: "cut-color", item: "cut-and-color" },
  { id: "texture", label: "STRAIGHT", concern: "湿気で髪が広がりやすい", description: "気になるのは全体か、前髪や顔まわりだけか。髪の状態と施術履歴を見ながら、カットで整えるか、ストレートを検討するかをお話しします。", group: "perm-care", item: "straight" },
  { id: "ends", label: "CARE", concern: "毛先のパサつきが気になる", description: "手触りが気になる場所や、普段の乾かし方・アイロンの使い方を伺います。髪の状態に応じたケアと、家でも続けやすいお手入れをご相談ください。", group: "perm-care", item: "treatment" },
] as const;

export const news = [
  { date: "2026.11.12", dateTime: "2026-11-12", category: "GUIDE", title: "髪のお悩みから、メニューを探せるようになりました。", body: "朝のセット、色選び、湿気での広がり、毛先のケア。気になることから、相談の内容とメニューの目安をご覧いただけます。実際の施術は髪の状態を見てご相談する想定です。" },
  { date: "2026.10.20", dateTime: "2026-10-20", category: "SALON", title: "sui のホームページができました。", body: "sui hair atelier の空間と、髪に向き合う考え方をご覧いただくためのホームページ制作見本です。店名・営業情報・料金・写真はデモ用であり、実在する美容室のサイトではありません。" },
  { date: "2026.10.01", dateTime: "2026-10-01", category: "INFORMATION", title: "初めてのお客様へ、ご予約のご案内。", body: "普段ご利用中の予約サイトやLINE公式アカウントへつなぐ構成です。このデモでは、予約サービスとLINEのトップページが開きます。サイト内で予約情報や個人情報を入力・送信する機能はありません。" },
] as const;

export const faqs = [
  { question: "髪型が決まっていなくても、大丈夫ですか？", answer: "「今の髪で、ここが気になる」「雰囲気を変えてみたい」。そんな言葉から相談できるサロンを想定しています。気になる写真や、いつものお手入れのことなど、会話しながらデザインを決めるご案内例です。" },
  { question: "どのメニューで予約すればよいですか？", answer: "ご利用の予約サイトにあるメニューをご確認ください。迷う場合は、実際の店舗の相談窓口へ。この制作見本では、お店の予約ページとLINE公式アカウントへつなぐ導線を用意しています。" },
  { question: "表示の料金には、何が含まれていますか？", answer: "表示はすべて税込です。カットはシャンプー・ブロー込みの設定です。カラーやパーマなどは内容・長さ・髪の状態により異なる想定のため、実際の店舗では施術前に料金をご確認いただく案内を掲載します。すべてデモ料金です。" },
  { question: "写真を見せて、イメージを相談できますか？", answer: "気になる写真があれば、好きなところや、反対に避けたい雰囲気もお伝えください。写真がなくても、普段のお手入れや髪のお悩みからご相談いただける想定です。" },
] as const;
