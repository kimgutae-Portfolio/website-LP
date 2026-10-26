import type {Metadata} from "next";
import {NagiStayPage} from "@/components/demo/nagi/NagiStayPage";
const title="過ごし方を選ぶ｜旅宿 凪 ― 滞在プランナー制作見本";
const description="過ごし方と泊数から、滞在のイメージと参考料金を確認する制作見本。実際の空室照会・予約・送信は行いません。";
export const metadata:Metadata={title,description,robots:{index:false,follow:true},alternates:{canonical:"/demo/nagi/stay"},openGraph:{title,description,url:"/demo/nagi/stay",images:["/demo/nagi/hero.webp"]},twitter:{card:"summary_large_image",title,description,images:["/demo/nagi/hero.webp"]}};
export default function StayDemo(){return <NagiStayPage/>;}
