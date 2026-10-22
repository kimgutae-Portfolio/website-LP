"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { LogoMark } from "../Logo";
import { REEL_DURATION, reelSceneAt } from "./reel";
import styles from "./home.module.css";

export interface ReelScene { name: string; category: string; url: string }

export function HeroExperience({children,scenes,poster}:{children:ReactNode;scenes:readonly ReelScene[];poster:{src:string;alt:string}}) {
  const root=useRef<HTMLElement>(null);
  const video=useRef<HTMLVideoElement>(null);
  const [entry,setEntry]=useState<"playing"|"complete">("playing");
  const [preferences,setPreferences]=useState({ready:false,reduced:false,saveData:false});
  const [inView,setInView]=useState(false);
  const [pageVisible,setPageVisible]=useState(true);
  const [mode,setMode]=useState<"auto"|"manual"|"paused">("auto");
  const [requested,setRequested]=useState(false);
  const [playing,setPlaying]=useState(false);
  const [hasFrame,setHasFrame]=useState(false);
  const [timeline,setTimeline]=useState({scene:0,progress:0});
  const finishEntry=()=>setEntry("complete");

  useEffect(()=>{
    const preference=window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection=(navigator as Navigator&{connection?:{saveData?:boolean;effectiveType?:string}}).connection;
    const saveData=!!connection?.saveData||connection?.effectiveType==="2g"||connection?.effectiveType==="slow-2g";
    const update=()=>{
      setPreferences({ready:true,reduced:preference.matches,saveData});
      if(preference.matches){setEntry("complete");setMode("paused");}
    };
    update();
    if((window.location.hash&&window.location.hash!=="#top")||window.scrollY>32)setEntry("complete");
    // CSS also finishes on its own: this is an opening, never a loading gate.
    const fallback=window.setTimeout(()=>setEntry("complete"),2700);
    const onKey=(event:KeyboardEvent)=>{if(event.key==="Escape"||event.key==="Tab")setEntry("complete");};
    const onScroll=()=>{if(window.scrollY>32)setEntry("complete");};
    const onHash=()=>{if(window.location.hash&&window.location.hash!=="#top")setEntry("complete");};
    const visibility=()=>setPageVisible(!document.hidden);
    visibility();
    preference.addEventListener("change",update);
    window.addEventListener("keydown",onKey);
    window.addEventListener("scroll",onScroll,{passive:true});
    window.addEventListener("hashchange",onHash);
    document.addEventListener("visibilitychange",visibility);
    const observer=new IntersectionObserver(([item])=>setInView(item.isIntersecting),{threshold:.08});
    if(root.current)observer.observe(root.current);
    return()=>{
      window.clearTimeout(fallback);observer.disconnect();preference.removeEventListener("change",update);
      window.removeEventListener("keydown",onKey);window.removeEventListener("scroll",onScroll);window.removeEventListener("hashchange",onHash);document.removeEventListener("visibilitychange",visibility);
    };
  },[]);

  const intent=mode==="manual"||(mode==="auto"&&!preferences.reduced&&!preferences.saveData);
  const shouldPlay=preferences.ready&&entry==="complete"&&intent&&inView&&pageVisible;
  useEffect(()=>{if(shouldPlay)setRequested(true);},[shouldPlay]);
  useEffect(()=>{
    const element=video.current;if(!element)return;
    let cancelled=false;
    if(shouldPlay){element.muted=true;void element.play().catch(()=>{if(!cancelled){setPlaying(false);setMode("paused");}});}
    else element.pause();
    return()=>{cancelled=true;};
  },[shouldPlay,requested]);

  const scene=scenes[timeline.scene]??scenes[0];
  return <section id="top" ref={root} data-home-hero data-entry={entry} className={styles.hero} aria-labelledby="home-hero-heading" onFocusCapture={finishEntry} onPointerDownCapture={finishEntry}>
    <div className={styles.heroInner}>{children}</div>
    <figure className={styles.media} data-hero-media onAnimationEnd={event=>{if(event.target===event.currentTarget)finishEntry();}}>
      <Image src={poster.src} alt={poster.alt} fill priority sizes="(max-width:700px) 100vw, 46vw" className={styles.poster}/>
      {requested&&<video ref={video} className={styles.film} data-visible={hasFrame} autoPlay={shouldPlay} muted playsInline loop preload="metadata" aria-hidden="true" tabIndex={-1}
        onPlaying={()=>{setPlaying(true);setHasFrame(true);}} onPause={()=>setPlaying(false)} onError={()=>{setPlaying(false);setMode("paused");setHasFrame(false);setTimeline({scene:0,progress:0});}}
        onTimeUpdate={event=>{const time=event.currentTarget.currentTime;setTimeline({scene:reelSceneAt(time),progress:Math.min(1,time/REEL_DURATION)});}}>
        <source src="/home/design-reel-mobile.mp4" type="video/mp4" media="(max-width:700px)"/>
        <source src="/home/design-reel.mp4" type="video/mp4"/>
      </video>}
      <div className={styles.filmShade} aria-hidden="true"/>
      <div className={styles.reelTop}><span>DESIGN REEL <i aria-hidden="true"/></span><button type="button" className={styles.playControl} aria-label={playing?"映像を一時停止":"映像を再生"} aria-pressed={playing} onClick={()=>{finishEntry();if(playing){setMode("paused");video.current?.pause();}else{setMode("manual");setRequested(true);}}}>
        {playing?<svg width="12" height="14" viewBox="0 0 12 14" fill="currentColor" aria-hidden="true"><path d="M1 1H4V13H1ZM8 1H11V13H8Z"/></svg>:<svg width="12" height="14" viewBox="0 0 12 14" fill="currentColor" aria-hidden="true"><path d="M2 1L11 7L2 13Z"/></svg>}
        <span>{playing?"PAUSE":"PLAY"}</span>
      </button></div>
      <figcaption className={styles.reelCaption}><div><span>{scene.category}のホームページ</span><a href={scene.url} target="_blank" rel="noopener noreferrer" onFocus={()=>{setMode("paused");video.current?.pause();}}><span className={styles.reelName}>{scene.name}</span><span className={styles.reelView}>制作見本を見る</span><span className="sr-only">（新しいタブで開きます）</span></a><p>架空の店舗・企業の制作見本をもとにしたイメージ映像</p></div><span className={styles.sceneCounter}>0{timeline.scene+1}<small> / 03</small></span></figcaption>
      <div className={styles.reelProgress} aria-hidden="true"><span style={{transform:`scaleX(${timeline.progress})`}}/></div>
    </figure>
    <div className={styles.entryBrand} data-opening-mark aria-hidden="true"><LogoMark className={styles.entryLogo}/><span>まちのWeb</span><small>お店のらしさ、その先へ。</small></div>
    <a href="#demo" className={styles.scrollCue} data-hero-copy><span>SCROLL TO EXPLORE</span><span className={styles.scrollLine} aria-hidden="true"/></a>
  </section>;
}
