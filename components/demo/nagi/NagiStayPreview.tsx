import Image from "next/image";
import Link from "next/link";
import styles from "./stay.module.css";
export function NagiStayPreview(){return <section id="nagi-journey" className={styles.preview} aria-labelledby="nagi-journey-heading"><div className={styles.previewPhoto}><Image src="/demo/nagi/room.webp" alt="庭を眺める和室で、ゆっくり過ごす滞在のイメージ" fill sizes="(max-width:700px) 100vw,50vw"/></div><div className={styles.previewCopy} data-demo-reveal><p>YOUR OWN QUIET JOURNEY.</p><h2 id="nagi-journey-heading">あなたの旅に、<br/>余白をつくる。</h2><p>本を読む日も、季節を味わう日も。<br/>過ごし方と泊数を選んで、<br/>凪での時間を、少しだけ思い描く。</p><Link href="/demo/nagi/stay">過ごし方を選んでみる<span>STAY PLANNER</span></Link><small>空室検索・予約ではなく、滞在と参考料金のシミュレーションです。</small></div></section>;}
