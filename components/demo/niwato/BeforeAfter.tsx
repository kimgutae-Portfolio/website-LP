"use client";
import Image from "next/image";
import { useState, type CSSProperties } from "react";
import styles from "./niwato.module.css";

export function BeforeAfter() {
  const [position, setPosition] = useState(50);
  return <div className={styles.comparison}>
    <div className={styles.comparisonFrame} style={{"--split":`${position}%`} as CSSProperties}>
      <Image src="/demo/niwato/before.webp" alt="芝が伸び、縁が不揃いになった庭の生成イメージ" fill sizes="(max-width:700px) 100vw, 85vw"/>
      <div className={styles.afterPhoto}><Image src="/demo/niwato/after.webp" alt="同じ庭を芝刈りし、縁まで整えた生成イメージ" fill sizes="(max-width:700px) 100vw, 85vw"/></div>
      <span className={styles.beforeTag}>BEFORE</span><span className={styles.afterTag}>AFTER</span>
      <div className={styles.splitLine} aria-hidden="true"><span>〈　〉</span></div>
      <input type="range" min="0" max="100" value={position} onChange={event=>setPosition(Number(event.target.value))} aria-label="お手入れ前後の写真を比較" aria-valuetext={`お手入れ後の写真 ${100-position}パーセント表示`}/>
    </div>
    <div className={styles.comparisonCaption}><span>左右に動かして、変化を見る <span aria-hidden="true">↔</span></span><small>生成画像による仕上がりイメージ。実際の施工実績ではありません。</small></div>
  </div>;
}
