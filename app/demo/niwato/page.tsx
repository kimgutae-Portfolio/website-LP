import type { Metadata } from "next";
import { NiwatoWebsite } from "@/components/demo/niwato/NiwatoWebsite";
export const metadata: Metadata = {
  title: "NIWATO｜庭のいい日を、毎月。― 月額サービスサイト制作見本",
  description: "芝刈りから庭の仕上げまで、月額定期ケアのサービス販売サイト制作見本。プラン選択とカード月額決済のデモを体験できます。実際の契約・課金はありません。",
  robots: {index:false,follow:true}, alternates:{canonical:"/demo/niwato"},
  openGraph:{title:"NIWATO — 庭のいい日を、毎月。",url:"/demo/niwato",images:[{url:"/demo/niwato/hero.webp",width:1536,height:1024}]},
  twitter:{card:"summary_large_image",title:"NIWATO — 庭のいい日を、毎月。",description:"月額の芝生ケアサービスの制作見本。プラン選択とカード決済の流れを体験できます。実際の課金・契約はありません。",images:["/demo/niwato/hero.webp"]},
};
export default function NiwatoDemo(){return <NiwatoWebsite/>;}
