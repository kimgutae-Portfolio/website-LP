import type {Metadata} from "next";
import {MichiruContactPage} from "@/components/demo/michiru/MichiruContactPage";
const title="体験・お問い合わせ｜みちる英語教室 ― フォーム制作見本";
const description="入力・確認・完了を体験できる英語教室のフォーム制作見本。実際の送信・予約・個人情報の保存は行いません。";
export const metadata:Metadata={title,description,robots:{index:false,follow:true},alternates:{canonical:"/demo/michiru/contact"},openGraph:{title,description,url:"/demo/michiru/contact",images:[{url:"/demo/michiru/hero-no-people.webp",width:1536,height:1024}]},twitter:{card:"summary_large_image",title,description,images:["/demo/michiru/hero-no-people.webp"]}};
export default function ContactDemo(){return <MichiruContactPage/>;}
