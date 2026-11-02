"use client";

import {useEffect,useState,type ReactNode} from "react";

export function FloatingLineAfterHero({children}:{children:ReactNode}) {
  const [visible,setVisible]=useState(false);
  useEffect(()=>{
    const hero=document.querySelector("[data-home-hero]");
    const contact=document.querySelector("#contact");
    if(!hero&&!contact){setVisible(true);return;}
    if(typeof IntersectionObserver==="undefined") return;
    let heroVisible=Boolean(hero),contactVisible=false;
    const observer=new IntersectionObserver(entries=>{
      for(const entry of entries){
        if(entry.target===hero) heroVisible=entry.isIntersecting;
        if(entry.target===contact) contactVisible=entry.isIntersecting;
      }
      // The contact section already has the real LINE action and form. Do not
      // cover either of them with a duplicate fixed button on small screens.
      setVisible(!heroVisible&&!contactVisible);
    },{threshold:0});
    if(hero) observer.observe(hero);
    if(contact) observer.observe(contact);
    return()=>observer.disconnect();
  },[]);
  return visible?children:null;
}
