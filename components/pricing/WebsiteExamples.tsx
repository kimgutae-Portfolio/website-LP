"use client";
import Image from "next/image";
import Link from "next/link";
import {useEffect,useRef,useState} from "react";
import type {WebsiteExample} from "@/site.config";
import {exampleScrollTarget} from "./example-scroll";
import styles from "./pricing.module.css";

function GalleryArrow({previous=false}:{previous?:boolean}){
 return <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true" focusable="false"><path d={previous?"M21 9H11V4L3 12L11 20V15H21V9Z":"M3 9H13V4L21 12L13 20V15H3V9Z"}/></svg>;
}

export function WebsiteExamples({examples,note}:{examples:readonly WebsiteExample[];note:string}){
 const rail=useRef<HTMLDivElement>(null);
 const [edges,setEdges]=useState({start:true,end:false,progress:0});
 useEffect(()=>{
  const element=rail.current;if(!element)return;
  const update=()=>{
   const max=Math.max(0,element.scrollWidth-element.clientWidth);
   const left=Math.max(0,Math.min(max,element.scrollLeft));
   const next={start:left<=2,end:max-left<=2,progress:max?left/max:0};
   setEdges(old=>old.start===next.start&&old.end===next.end&&Math.abs(old.progress-next.progress)<.002?old:next);
  };
  update();element.addEventListener("scroll",update,{passive:true});
  const observer=new ResizeObserver(update);observer.observe(element);
  return()=>{observer.disconnect();element.removeEventListener("scroll",update);};
 },[]);
 const move=(direction:-1|1)=>{
  const element=rail.current;if(!element)return;
  const offsets=Array.from(element.children).map(child=>(child as HTMLElement).offsetLeft);
  const left=exampleScrollTarget(element.scrollLeft,element.scrollWidth,element.clientWidth,offsets,direction);
  element.scrollTo({left,behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"});
 };
 return <div id="website-examples" className={styles.examples}>
  <div className={styles.examplesHeading}><p className={styles.eyebrow}>EXPLORE THE DESIGNS</p><span>{String(examples.length).padStart(2,"0")} WEBSITES</span></div>
  <div id="website-examples-rail" ref={rail} className={styles.exampleRail} role="region" aria-label="業種別の制作見本。横にスクロールできます" tabIndex={0} onKeyDown={event=>{
   if(event.target!==event.currentTarget)return;
   if(event.key==="ArrowLeft"||event.key==="ArrowRight"){event.preventDefault();move(event.key==="ArrowLeft"?-1:1);}
   else if(event.key==="Home"||event.key==="End"){event.preventDefault();const element=rail.current;element?.scrollTo({left:event.key==="Home"?0:element.scrollWidth,behavior:"auto"});}
  }}>
   {examples.map((example,index)=><Link key={example.url} href={example.url} target="_blank" rel="noopener noreferrer" className={styles.exampleCard} aria-label={`${example.category}：${example.name}の制作見本を開く（新しいタブ）`}>
    <div className={styles.examplePhoto} style={{background:example.background}}><Image src={example.image} alt={example.imageAlt} fill sizes="(max-width:700px) 78vw, 310px" style={{objectFit:example.imageMode??"cover",objectPosition:example.position}}/><span>制作見本を見る</span></div>
    <div className={styles.exampleCaption}><div><p>{example.category}</p><span>{String(index+1).padStart(2,"0")}</span></div><h3>{example.name}</h3><p>{example.detail}</p></div>
   </Link>)}
  </div>
  <div className={styles.railNavigation}><span>横にスワイプ<small>見本は新しいタブで開きます</small></span><div className={styles.progress} aria-hidden="true"><span style={{transform:`scaleX(${.12+.88*edges.progress})`}}/></div><div className={styles.railButtons}><button type="button" data-direction="previous" onClick={()=>move(-1)} disabled={edges.start} aria-label="前の制作見本" aria-controls="website-examples-rail"><GalleryArrow previous/></button><button type="button" data-direction="next" onClick={()=>move(1)} disabled={edges.end} aria-label="次の制作見本" aria-controls="website-examples-rail"><GalleryArrow/></button></div></div>
  <p className={styles.examplesNote}>{note}<br/>すべて架空の店舗・企業の制作見本です。実際の運営情報・制作実績ではありません。</p>
 </div>;
}
