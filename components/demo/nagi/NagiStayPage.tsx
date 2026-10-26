"use client";
import Image from "next/image";
import Link from "next/link";
import {useState} from "react";
import {DemoNotice,DemoShell} from "../shared/PremiumDemo";
import {bookingUrl} from "./content";
import {stayStyles,stayEstimate} from "./stay-data";
import styles from "./stay.module.css";
export function NagiStayPage(){
  const [style,setStyle]=useState(0),[nights,setNights]=useState(1);
  const selected=stayStyles[style],estimate=stayEstimate(style,nights);
  return <DemoShell className={styles.site} revision={`${style}-${nights}`}>
    <div className={styles.demoBar}><span>旅宿 凪 / STAY PLANNER</span><Link href="/#demo">まちのWebへ戻る</Link></div>
    <header className={styles.header}><Link href="/demo/nagi" className={styles.brand}><small>旅宿</small>凪<span>NAGI</span></Link><Link href="/demo/nagi#nagi-room">客室・館内</Link><Link href="/demo/nagi#nagi-stay">宿泊案内</Link></header>
    <main><nav className={styles.breadcrumbs} aria-label="パンくずリスト"><Link href="/demo/nagi">旅宿 凪</Link><span>/</span><span aria-current="page">過ごし方を選ぶ</span></nav>
      <section className={styles.heading}><div><p>MAKE ROOM FOR YOURSELF.</p><h1>何をするか、より。<br/>どう、過ごそうか。</h1><p>好きな時間を選びながら、<br/>まだ決めない旅を、思い描く。</p></div><div className={styles.headingPhoto}><Image src="/demo/nagi/hero.webp" alt="木の縁側と苔庭の、静かな午後のイメージ" fill sizes="(max-width:700px) 100vw,65vw" priority data-hero-image/></div></section>
      <section className={styles.planner} aria-labelledby="nagi-planner-heading"><div className={styles.plannerIntro}><span>STAY PLANNER</span><h2 id="nagi-planner-heading">凪での時間を、選ぶ。</h2><p>ご予約前に、過ごし方と料金感を知るための見本です。<br/>日付・空室状況の確認や予約確定は行いません。</p></div>
      <div className={styles.plannerGrid}><div><fieldset className={styles.styleChoices}><legend>大切にしたい、旅の時間。</legend>{stayStyles.map((item,i)=><label key={item.id}><input type="radio" name="nagi-stay-style" checked={style===i} onChange={()=>setStyle(i)}/><div><span>{item.english}</span><strong>{item.name}</strong><small>{i===0?"素泊まり / 食事なし":"一泊二食 / 夕食・朝食付き"}</small></div><i aria-hidden="true"/></label>)}</fieldset><fieldset className={styles.nights}><legend>ゆっくりするのは、何泊？</legend><div>{[1,2].map(value=><label key={value}><input type="radio" name="nagi-stay-nights" checked={nights===value} onChange={()=>setNights(value)}/><span>{value}<small>泊</small></span></label>)}</div><p>大人2名・1室利用での参考設定です。</p></fieldset></div>
      <div className={styles.summary} aria-live="polite"><span>YOUR STAY / IMAGE</span><h3>{selected.name}</h3><p>{nights}泊・大人2名・1室</p><div className={styles.total}><small>ご滞在の参考合計（税込）</small><strong>¥{estimate.total.toLocaleString("ja-JP")}<i>〜</i></strong></div><dl><div><dt>1名・1泊あたり</dt><dd>¥{estimate.perPerson.toLocaleString("ja-JP")}〜</dd></div><div><dt>お食事</dt><dd>{style===0?"食事なし":"夕食・朝食付き"}</dd></div><div><dt>チェックイン</dt><dd>{style===0?"15:00–19:00":"15:00–17:00"}</dd></div></dl><small className={styles.disclaimer}>架空の料金を使った目安です。実際の料金・追加費用・条件は予約先でご確認ください。入力内容は送信・保存しません。</small><a href={bookingUrl} target="_blank" rel="noopener noreferrer" className={styles.book}>予約サービスで条件を確認<small>外部サイトのトップページを開きます</small></a></div></div></section>
      <section className={styles.itinerary} aria-labelledby="nagi-itinerary-heading"><div className={styles.itineraryPhoto} key={selected.id}><Image src={`/demo/nagi/${selected.image}.webp`} alt={style===0?"庭の光が差す、畳と障子の和室のイメージ":"季節の焼き魚と野菜を並べた宿の食卓のイメージ"} fill sizes="(max-width:700px) 100vw,60vw"/><span>{selected.english}</span></div><div className={styles.itineraryCopy}><p>YOUR UNHURRIED DAYS.</p><h2 id="nagi-itinerary-heading">こんな一日を、<br/>思い浮かべて。</h2><p aria-live="polite">{selected.description}</p><ol>{[["DAY 1 / 15:00","荷物をほどき、庭へ。"],["16:00",selected.afternoon],["18:30",selected.evening],...(nights===2?[["DAY 2","時計を置いて、もう一日。"]]:[]),[`DAY ${nights+1} / 11:00`,"また来たくなる、余韻と。"]].map(([time,text])=><li key={time}><time>{time}</time><span>{text}</span></li>)}</ol><small>館内サービスや時刻は、架空の滞在イメージです。</small></div></section>
      <div className={styles.return}><Link href="/demo/nagi">旅宿 凪のトップへ戻る</Link><a href="#nagi-planner-heading">もう一度、過ごし方を選ぶ</a></div>
    </main><footer className={styles.footer}><DemoNotice/></footer>
  </DemoShell>;
}
