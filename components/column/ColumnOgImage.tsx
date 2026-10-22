import { ImageResponse } from "next/og";
import { siteConfig } from "@/site.config";

export async function columnOgImage(title:string,category:string) {
  const text=`${title}${category}お役立ちコラムまちのWebmachinowebs.com`;
  const css=await(await fetch(`https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@700&text=${encodeURIComponent(text)}`)).text();
  const source=css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/)?.[1];
  if(!source)throw new Error("Column OG font could not be loaded");
  const font=await(await fetch(source)).arrayBuffer();
  return new ImageResponse(<div style={{width:"100%",height:"100%",display:"flex",flexDirection:"column",justifyContent:"space-between",background:"#f2f1e7",color:"#24483a",fontFamily:"NotoSansJP",padding:"53px 68px",fontWeight:700}}>
    <div style={{display:"flex",justifyContent:"space-between",fontSize:22,color:"#648061",borderBottom:"1px solid #b5c7ac",paddingBottom:24}}><span>お役立ちコラム</span><span>{category}</span></div>
    <div style={{display:"flex",fontSize:title.length>40?48:55,lineHeight:1.65,letterSpacing:-1,maxWidth:1030}}>{title}</div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:30,borderTop:"1px solid #b5c7ac",paddingTop:24}}><span>{siteConfig.meta.siteName}</span><span style={{fontSize:23,color:"#648061"}}>machinowebs.com</span></div>
  </div>,{width:1200,height:630,fonts:[{name:"NotoSansJP",data:font,weight:700}]});
}
