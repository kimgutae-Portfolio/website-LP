import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {kasaneProjects} from "@/components/demo/kasane/content";
import {KasaneProjectPage} from "@/components/demo/kasane/KasaneProjectPage";
export function generateStaticParams(){return kasaneProjects.map(project=>({slug:project.id}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const {slug}=await params;const project=kasaneProjects.find(item=>item.id===slug);if(!project)return {};const title=`${project.name}｜KASANE プロジェクトストーリー ― 制作見本`;const description=`${project.title} 空間づくりの考え方・素材・詳細を伝える、架空のプロジェクト紹介ページです。`;return {title,description,robots:{index:false,follow:true},alternates:{canonical:`/demo/kasane/projects/${slug}`},openGraph:{title,description,url:`/demo/kasane/projects/${slug}`,images:[project.image]},twitter:{card:"summary_large_image",title,description,images:[project.image]}};}
export default async function ProjectDemo({params}:{params:Promise<{slug:string}>}){const {slug}=await params;if(slug!=="workplace"&&slug!=="atelier")notFound();return <KasaneProjectPage slug={slug}/>;}
