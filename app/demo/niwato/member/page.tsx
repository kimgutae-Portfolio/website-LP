import type {Metadata} from "next";
import {NiwatoMemberPage} from "@/components/demo/niwato/NiwatoMemberPage";
const title="MY GARDEN｜NIWATO ― マイページ制作見本";
const description="訪問日変更・作業レポート・月額プラン変更・請求明細・休止の表示を体験する、ログイン不要のデモ。実際の手続き・保存・課金はありません。";
export const metadata:Metadata={title,description,robots:{index:false,follow:true},alternates:{canonical:"/demo/niwato/member"},openGraph:{title,description,url:"/demo/niwato/member",images:["/demo/niwato/after.webp"]},twitter:{card:"summary_large_image",title,description,images:["/demo/niwato/after.webp"]}};
export default function MemberDemo(){return <NiwatoMemberPage/>;}
