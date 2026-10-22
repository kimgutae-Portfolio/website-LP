export const processes = [
 { id: "milling", label: "切削加工", english: "MILLING", title: "複雑なかたちを、\n確かな輪郭に。", description: "面、溝、穴。その一つひとつの関係を読み解きながら、図面の意図を立体にしていく。マシニングセンタによる部品加工を想定した紹介例です。", materials: "アルミニウム / ステンレス / 鉄", applications: "装置部品・治具・ブラケット", image: "hero" },
 { id: "turning", label: "旋盤加工", english: "TURNING", title: "回るものには、\nぶれない精度を。", description: "円筒形状の外径や内径、段差や端面まで。用途や組み付けを考えながら、形状と仕上がりを整える旋盤加工の紹介例です。", materials: "ステンレス / 鉄 / アルミニウム", applications: "カラー・シャフト・フランジ", image: "parts" },
 { id: "prototype", label: "試作・小ロット", english: "PROTOTYPING", title: "まだない答えを、\n一緒につくる。", description: "図面が固まる前の相談も、まずは一つつくって確かめたいときも。形状、材質、使い方から考える試作相談を想定しています。", materials: "用途に応じてご相談", applications: "開発試作・補修部品・小ロット", image: "inspection-no-people" },
] as const;
export const examples = [
 { name: "アルミ切削ブラケット", category: "MILLING / ALUMINUM", image: "parts", position: "50% 50%", description: "面と穴の位置関係を考えたブラケットの製品イメージ。図面確認、材料手配、加工、検査までの対応を紹介するための制作例です。" },
 { name: "ステンレスカラー", category: "TURNING / STAINLESS", image: "parts", position: "22% 55%", description: "軸まわりに使う円筒部品を想定したイメージ。内外径の関係や仕上げについて、用途から相談する流れを紹介します。" },
 { name: "試作・治具部品", category: "PROTOTYPE / SMALL LOT", image: "inspection-no-people", position: "50% 50%", description: "機能を確認する試作や、作業を支える治具の相談例。数値精度・納期・数量などは実際の案件ごとに確認する想定です。" },
] as const;
export const news = [
 { date: "2026.10.20", category: "COMPANY", title: "セッカ精工の制作見本サイトを公開しました。", body: "金属加工の技術と、現場の考え方を伝える架空の企業サイトです。写真と製品はイメージであり、実際の設備や納入実績を示すものではありません。" },
 { date: "2026.10.12", category: "TECHNOLOGY", title: "加工サンプルの紹介を追加しました。", body: "切削・旋盤・試作の紹介例を追加しました。実際の加工可否や精度は、材質・形状・数量などを確認したうえで判断する想定です。" },
 { date: "2026.10.01", category: "RECRUIT", title: "ものづくりの仕事を知る、という入口。", body: "仕事と現場の雰囲気を伝える採用案内の掲載例です。実際の求人募集・条件・採用受付は行っていません。" },
] as const;
