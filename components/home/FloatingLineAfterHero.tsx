"use client";

import {useEffect,useState,type ReactNode} from "react";

export function FloatingLineAfterHero({children}:{children:ReactNode}) {
  const [visible,setVisible]=useState(false);
  useEffect(()=>{
    const hero=document.querySelector("[data-home-hero]");
    if(!hero){setVisible(true);return;}
    const observer=new IntersectionObserver(([entry])=>setVisible(!entry.isIntersecting),{threshold:0});
    observer.observe(hero);return()=>observer.disconnect();
  },[]);
  return visible?children:null;
}
