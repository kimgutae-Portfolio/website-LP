"use client";
import Image from "next/image";
import Link from "next/link";
import {useEffect,useRef,useState} from "react";
import type {WebsiteExample} from "@/site.config";
import {exampleScrollTarget} from "./example-scroll";
import {formatInitialPrice} from "@/lib/example-offers";
import styles from "./gallery.module.css";

function GalleryArrow({previous=false}:{previous?:boolean}){
 return <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true" focusable="false"><path d={previous?"M21 9H11V4L3 12L11 20V15H21V9Z":"M3 9H13V4L21 12L13 20V15H3V9Z"}/></svg>;
}

export function WebsiteExamples({examples,note}:{examples:readonly WebsiteExample[];note:string}){
 const [filter,setFilter]=useState<"all"|"zero"|"custom">("all");
 const visibleExamples=examples.filter(example=>filter==="all"||(filter==="zero"?example.offer.kind==="zero":example.offer.kind!=="zero"));
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
 },[filter]);
 const changeFilter=(next:"all"|"zero"|"custom")=>{setFilter(next);rail.current?.scrollTo({left:0,behavior:"auto"});};
 const move=(direction:-1|1)=>{
  const element=rail.current;if(!element)return;
  const offsets=Array.from(element.children).map(child=>(child as HTMLElement).offsetLeft);
  const left=exampleScrollTarget(element.scrollLeft,element.scrollWidth,element.clientWidth,offsets,direction);
  element.scrollTo({left,behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"});
 };
 return <div id="website-examples" className={styles.examples}>
  <div className={styles.exampleFilters} role="group" aria-label="制作初期費用で見本を絞り込む">{([["all","すべて"],["zero","初期0円の制作例"],["custom","追加制作費のある例"]] as const).map(([value,label])=><button key={value} type="button" aria-pressed={filter===value} aria-controls="website-examples-rail" onClick={()=>changeFilter(value)}>{label}<span>{value==="all"?examples.length:examples.filter(example=>value==="zero"?example.offer.kind==="zero":example.offer.kind!=="zero").length}</span></button>)}</div>
  {filter==="custom"&&<div className={styles.upgradeIntro}><p>BEYOND A SINGLE PAGE</p><h3>「伝える」から、<br/>「選ぶ・相談する・使い続ける」まで。</h3><p>初期0円の基本1ページに、詳しく伝えるページやお客様が使える機能をプラス。4つの見本で、違いを実際に体験できます。実際の送信・予約・課金は行わないデモです。</p></div>}
  <div className={styles.examplesHeading}><p className={styles.eyebrow}>EXPLORE THE DESIGNS</p><div className={styles.examplesTools}><span className={styles.examplesCount} aria-live="polite">{String(visibleExamples.length).padStart(2,"0")} WEBSITES</span><div className={styles.railButtons}><button type="button" data-direction="previous" onClick={()=>move(-1)} disabled={edges.start} aria-label="前の制作見本" aria-controls="website-examples-rail"><GalleryArrow previous/></button><button type="button" data-direction="next" onClick={()=>move(1)} disabled={edges.end} aria-label="次の制作見本" aria-controls="website-examples-rail"><GalleryArrow/></button></div></div></div>
  <div id="website-examples-rail" ref={rail} data-gallery-stage className={styles.exampleRail} role="region" aria-label="業種別の制作見本。横にスクロールできます" tabIndex={0} onKeyDown={event=>{
   if(event.target!==event.currentTarget)return;
   if(event.key==="ArrowLeft"||event.key==="ArrowRight"){event.preventDefault();move(event.key==="ArrowLeft"?-1:1);}
   else if(event.key==="Home"||event.key==="End"){event.preventDefault();const element=rail.current;element?.scrollTo({left:event.key==="Home"?0:element.scrollWidth,behavior:"auto"});}
  }}>
   {visibleExamples.map((example,index)=><article key={example.url} className={styles.exampleCard} data-gallery-card data-offer-kind={example.offer.kind}>
    <Link href={example.url} target="_blank" rel="noopener noreferrer" className={styles.examplePhoto} style={{background:example.background}} aria-label={`${example.category}：${example.name}の制作見本を開く（新しいタブ）`}><div className={styles.browserBar} aria-hidden="true"><i/><i/><i/><span>WEBSITE DESIGN / {String(index+1).padStart(2,"0")}</span></div><div className={styles.previewImage}><Image src={example.previewImage??example.image} alt={example.previewImage?`${example.name}のホームページ・ファーストビュー`:example.imageAlt} fill sizes="(max-width:700px) 86vw, (max-width:1100px) 60vw, 560px" style={{objectFit:example.previewImage?"contain":example.imageMode??"cover",objectPosition:example.previewImage?"center":example.position}}/></div><span>制作見本を見る</span></Link>
    <div className={styles.exampleCaption}><div><p>{example.category}</p><span>{String(index+1).padStart(2,"0")}</span></div><h3>{example.displayName??example.name}</h3><p>{example.detail}</p></div>
    <div className={styles.exampleOffer}><p>初期費用</p><strong>{formatInitialPrice(example.offer)}</strong><small>{example.offer.kind==="zero"?"基本1ページの場合・税込／月額別":example.offer.initialFrom===null?"月額運用費は別途":"税込／月額運用費は別途"}</small></div>
    <details className={styles.scopeDetails}>
     <summary>制作内容・費用の詳細</summary>
     <div>
      <p>{example.offer.label}</p>
      {example.offer.upgrade&&<div className={styles.upgradePreview}>
       <p>追加制作で、ここまで。</p>
       <h4>{example.offer.upgrade.title}</h4>
       <ul>{example.offer.upgrade.features.map(text=><li key={text}>{text}</li>)}</ul>
       <Link href={example.offer.upgrade.href} target="_blank" rel="noopener noreferrer">{example.offer.upgrade.cta}<span aria-hidden="true">＋</span></Link>
      </div>}
      <h4>{example.offer.includedHeading}</h4><ul>{example.offer.included.map(item=><li key={item}>{item}</li>)}</ul>
      <h4>追加制作費が必要なこと</h4><ul>{example.offer.additional.map(item=><li key={item}>{item}</li>)}</ul>
      <p>{example.offer.note}</p>
      {example.offer.breakdown&&<p>参考内訳：{example.offer.breakdown.map(item=>`${item.label} ${item.amount.toLocaleString("ja-JP")}円`).join(" ／ ")}（税込）</p>}
     </div>
    </details>
   </article>)}
  </div>
  <div className={styles.railNavigation}><span>横にスワイプ、または上のボタンで<small>見本は新しいタブで開きます</small></span><div className={styles.progress} aria-hidden="true"><span style={{transform:`scaleX(${.12+.88*edges.progress})`}}/></div></div>
  <p className={styles.examplesNote}>{note}<br/>すべて架空の店舗・企業の制作見本です。実際の運営情報・制作実績ではありません。</p>
 </div>;
}
