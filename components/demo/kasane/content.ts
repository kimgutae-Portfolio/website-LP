export const kasaneProjects = [
  {
    id: "workplace",
    number: "01",
    title: "余白が、人をつなぐ。",
    name: "KITA WORK LOUNGE",
    category: "ワークプレイス",
    type: "office",
    location: "Osaka, Japan",
    year: "2026",
    image: "/demo/kasane/workplace.webp",
    width: 1600,
    height: 900,
    alt: "オークの大きなテーブルとオリーブ色の椅子を配した、明るいワークラウンジの設計イメージ",
    description:
      "集まるためだけの場所から、自然と会話が生まれる場所へ。視線が抜けるガラスの間仕切りと、手触りのよい木のテーブル。働く人の一日を想像しながら、集中と交流がゆるやかに共存する空間を考えました。",
    scope: "企画・空間設計・内装施工",
  },
  {
    id: "atelier",
    number: "02",
    title: "街に、ひらく場所。",
    name: "TSUCHI ATELIER",
    category: "店舗・商業空間",
    type: "store",
    location: "Sakai, Japan",
    year: "2026",
    image: "/demo/kasane/atelier.webp",
    width: 1600,
    height: 1066,
    alt: "テラコッタの外壁と大きな窓、植栽が街並みになじむアトリエの建築イメージ",
    description:
      "かつての建物の表情を残しながら、街を歩く人にもひらかれたアトリエに。土の色をしたタイル、木の扉、季節を映す植栽。新しさと懐かしさが、日々の風景の中で静かに重なる計画です。",
    scope: "建築設計・リノベーション・外構計画",
  },
] as const;

export type KasaneProject = (typeof kasaneProjects)[number];

export const kasaneNews = [
  {
    date: "2026.10.15",
    dateTime: "2026-10-15",
    category: "PROJECT",
    title: "ワークプレイスの空間提案を公開しました。",
    text: "働く人と人のつながりを大切にした、ワークラウンジの空間提案を公開しました。素材の選定から光の入り方まで、日々の小さな心地よさを積み重ねたプロジェクトです。PROJECTSセクションよりご覧いただけます。",
  },
  {
    date: "2026.10.01",
    dateTime: "2026-10-01",
    category: "COMPANY",
    title: "コーポレートサイトをリニューアルしました。",
    text: "かさねが大切にしている考え方や、仕事のプロセスをお伝えするため、コーポレートサイトをリニューアルしました。私たちのものづくりを、写真やフィルムを通してご覧いただけます。",
  },
  {
    date: "2026.09.18",
    dateTime: "2026-09-18",
    category: "RECRUIT",
    title: "空間づくりの仲間を募集しています。",
    text: "設計・施工ディレクションの分野で、ともに空間づくりに向き合う仲間を募集しています。募集内容のサンプルは、このページのRECRUITセクションからご覧いただけます。",
  },
] as const;

export type KasaneNews = (typeof kasaneNews)[number];
