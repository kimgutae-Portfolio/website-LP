import type {Metadata} from "next";
import {MichiruCoursesPage} from "@/components/demo/michiru/MichiruCoursesPage";
const title="コース・月謝｜みちる英語教室 ― 制作見本";
const description="年齢別の3コースと月謝・時間割を紹介する独立ページの制作見本です。";
export const metadata:Metadata={title,description,robots:{index:false,follow:true},alternates:{canonical:"/demo/michiru/courses"},openGraph:{title,description,url:"/demo/michiru/courses",images:[{url:"/demo/michiru/hero-no-people.webp",width:1536,height:1024}]},twitter:{card:"summary_large_image",title,description,images:["/demo/michiru/hero-no-people.webp"]}};
export default function CoursesDemo(){return <MichiruCoursesPage/>;}
