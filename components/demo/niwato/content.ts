export const areas = [30, 60, 100] as const;
export type LawnArea = typeof areas[number];
export type CarePlan = "monthly" | "twice";
export const plans = [
  { id: "monthly" as const, name: "マイペース", visits: 1, label: "月1回の定期ケア", description: "庭のきれいを、無理なく保つ。", prices: {30:6600,60:9900,100:14300} },
  { id: "twice" as const, name: "いつも、きれい", visits: 2, label: "月2回の定期ケア", description: "よく伸びる季節も、こまめに。", prices: {30:11000,60:16500,100:24200} },
];
export function getQuote(area: LawnArea, planId: CarePlan) {
  const plan = plans.find(item => item.id === planId);
  if (!plan || !areas.includes(area)) throw new RangeError("Unsupported demo plan");
  const total = plan.prices[area];
  return { total, visits: plan.visits, name: plan.name, area, taxIncluded: true as const };
}
export function yen(amount: number) { return new Intl.NumberFormat("ja-JP").format(amount); }
export const seasons = [
  { label:"春", en:"SPRING", months:"3 — 5月", title:"伸びはじめに、ひと手間を。", text:"芝の状態を見ながら、刈り込みの高さを調整。冬を越えた庭の端まで、ゆっくり整えていきます。", task:"芝の状態確認 / 芝刈り / 際の仕上げ" },
  { label:"夏", en:"SUMMER", months:"6 — 8月", title:"元気に伸びる、その前に。", text:"よく伸びる季節は、定期的な刈り込みを。暑さや乾き具合にも目を配り、お手入れの目安をお伝えします。", task:"定期的な芝刈り / 集草 / 水やりのアドバイス" },
  { label:"秋", en:"AUTUMN", months:"9 — 11月", title:"気持ちいい庭を、長く。", text:"落ち葉を片づけ、芝の伸び方に合わせて整える。庭で過ごす時間が心地よくなるよう、細部まで。", task:"芝刈り / 落ち葉清掃 / 庭まわりの確認" },
  { label:"冬", en:"WINTER", months:"12 — 2月", title:"休む芝にも、気を配る。", text:"芝の生育がゆっくりな時季は、無理に刈りません。落ち葉の清掃や状態確認など、その庭に必要なケアへ。", task:"落ち葉清掃 / 芝の状態確認 / 春への準備" },
];
export const faqs = [
  ["留守でもお願いできますか？", "立ち入り方法や作業範囲を事前に確認できる場合は、ご不在でも作業できる設定です。作業後は写真付きのレポートでお知らせします。施錠やペットなどの条件は、開始前に相談します。"],
  ["雨の日はどうなりますか？", "安全や芝の状態を優先し、雨天時は日程を調整します。振替候補日を事前にご案内する運用を想定しています。"],
  ["月額以外にかかる費用はありますか？", "表示は税込のサンプル料金です。芝刈り・際の仕上げ・集草・通常量の刈り草回収を含みます。大きく伸びた庭の初回整備、樹木剪定、薬剤散布、芝の張り替えは含まず、必要な場合は事前見積もりです。無断で追加はしません。"],
  ["冬も同じ月額ですか？", "このデモでは通年の月額契約を想定しています。冬は刈り込みに代わって落ち葉清掃や状態確認を行います。訪問回数は選択したプランのままです。"],
  ["解約・プラン変更はできますか？", "デモの契約条件では最低利用期間なし・1か月ごとの自動更新です。次回更新日の7日前までに連絡すると、次回以降の解約・変更ができる設定です。実際の受付や契約は行っていません。"],
  ["ここで本当に申し込めますか？", "このサイトは架空のサービスの制作見本です。申込画面では用意されたサンプルカードを使い、月額購入の流れだけを体験できます。カード情報の入力・送信、課金、訪問依頼は発生しません。"],
] as const;
