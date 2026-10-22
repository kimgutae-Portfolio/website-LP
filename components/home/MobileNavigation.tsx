"use client";

import {useEffect,useRef,useState} from "react";
import styles from "./home.module.css";

export function MobileNavigation({items,homeHref}:{items:readonly {href:string;label:string}[];homeHref:string}) {
  const menu=useRef<HTMLDetailsElement>(null);
  const [open,setOpen]=useState(false);
  useEffect(()=>{
    const close=(event:KeyboardEvent)=>{if(event.key==="Escape"&&menu.current?.open){menu.current.open=false;menu.current.querySelector("summary")?.focus();}};
    const outside=(event:PointerEvent)=>{if(menu.current?.open&&!menu.current.contains(event.target as Node))menu.current.open=false;};
    document.addEventListener("keydown",close);document.addEventListener("pointerdown",outside);
    return()=>{document.removeEventListener("keydown",close);document.removeEventListener("pointerdown",outside);};
  },[]);
  const closeMenu=()=>{if(menu.current)menu.current.open=false;};
  return <details ref={menu} className={styles.mobileMenu} onToggle={event=>setOpen(event.currentTarget.open)}>
    <summary role="button" aria-label="メニュー" aria-expanded={open} aria-controls="site-mobile-navigation"><svg width="20" height="16" viewBox="0 0 20 16" fill="none" stroke="currentColor" aria-hidden="true"><path d="M1 4H19M1 12H19"/></svg></summary>
    <nav id="site-mobile-navigation" aria-label="モバイルメニュー">{items.map(item=><a key={item.href} href={`${homeHref}${item.href}`} onClick={closeMenu}>{item.label}</a>)}<a href={`${homeHref}#contact`} onClick={closeMenu}>フォームで相談</a></nav>
  </details>;
}
