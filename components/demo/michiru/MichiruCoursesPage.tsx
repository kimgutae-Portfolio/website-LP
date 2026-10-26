"use client";
import Image from "next/image";
import Link from "next/link";
import {useState} from "react";
import {Arrow} from "../shared/PremiumDemo";
import {MichiruSubpageFrame} from "./MichiruSubpageFrame";
import {courses,phrases} from "./content";
import styles from "./michiru.module.css";
import pages from "./michiru-pages.module.css";

export function MichiruCoursesPage() {
  const [course,setCourse]=useState(0);
  const [phrase,setPhrase]=useState(0);
  const selected=courses[course];
  return <MichiruSubpageFrame current="courses" revision={`${course}-${phrase}`}>
    <section id="michiru-page-top" className={`${pages.pageHeading} ${styles.container}`}><div><p className={styles.eyebrow}>FIND YOUR CLASS.</p><h1>いまのあなたに、<br/><span>ちょうどいい学びを。</span></h1><p>はじめてのひとことも、もう一歩先の会話も。<br/>年齢や経験に合わせて、一緒に見つけよう。</p></div><div className={pages.headingPhoto}><Image src="/demo/michiru/activity-no-people.webp" alt="色鉛筆と英語の絵カードが並ぶレッスン準備のイメージ" fill sizes="(max-width:700px) 85vw,45vw" priority data-hero-image/><span>COURSES & TUITION / SAMPLE</span></div></section>
    <section id="michiru-courses" className={`${styles.courses} ${styles.container}`} aria-labelledby="michiru-courses-heading"><div className={styles.sectionHeading} data-demo-reveal><div><p className={styles.eyebrow}>A LITTLE MORE ABOUT YOUR CLASS.</p><h2 id="michiru-courses-heading">コースと、月謝。</h2></div><p>気になるクラスを選んで、<br/>レッスンの内容をご覧ください。</p></div>
      <div className={styles.courseTabs} role="tablist" aria-label="英語のコース" onKeyDown={event=>{const next=event.key==="ArrowRight"?(course+1)%3:event.key==="ArrowLeft"?(course+2)%3:event.key==="Home"?0:event.key==="End"?2:null;if(next===null)return;event.preventDefault();setCourse(next);document.getElementById(`michiru-course-${next}`)?.focus();}}>{courses.map((item,index)=><button type="button" role="tab" key={item.id} id={`michiru-course-${index}`} aria-selected={course===index} aria-controls="michiru-course-panel" tabIndex={course===index?0:-1} onClick={()=>setCourse(index)}><span>{item.age}</span>{item.name}<small>{item.english}</small></button>)}</div>
      <div className={styles.coursePanel} role="tabpanel" id="michiru-course-panel" aria-labelledby={`michiru-course-${course}`}><div className={styles.courseDescription} key={selected.id}><p>{selected.english}</p><h3>{selected.name}</h3><p>{selected.description}</p><ul>{selected.points.map(point=><li key={point}><span aria-hidden="true">・</span>{point}</li>)}</ul></div><div className={styles.courseInformation}><div><span>レッスン時間</span><strong>{selected.time}</strong></div><div><span>時間割の例</span><p>{selected.day}</p></div><div className={styles.fee}><span>月謝（税込）</span><p><strong>¥{selected.fee}</strong><small>/ 月</small></p></div><Link href="/demo/michiru/contact" className={pages.courseContact}>このコースの体験について<Arrow/></Link></div></div>
      <p className={styles.smallNote}>月謝・コース・時間割は制作見本の設定です。実際の教室では、教材費・入会金・振替条件なども事前にご案内する想定です。<br/>実際の受講申込や、学習効果・成績向上の保証は行っていません。</p>
    </section>
    <section id="michiru-words" className={styles.words} aria-labelledby="michiru-words-heading"><div className={styles.container}><div className={styles.wordsHeading} data-demo-reveal><p className={styles.eyebrow}>ONE LITTLE PHRASE.</p><h2 id="michiru-words-heading">教室で育つ、ひとこと。</h2><p>ことばを選んで、みちるの考え方にふれてみよう。</p></div><div className={styles.phraseTabs} role="tablist" aria-label="教室で使う英語" onKeyDown={event=>{const next=event.key==="ArrowRight"?(phrase+1)%3:event.key==="ArrowLeft"?(phrase+2)%3:event.key==="Home"?0:event.key==="End"?2:null;if(next===null)return;event.preventDefault();setPhrase(next);document.getElementById(`michiru-phrase-${next}`)?.focus();}}>{phrases.map((item,index)=><button type="button" role="tab" key={item.english} id={`michiru-phrase-${index}`} aria-selected={phrase===index} aria-controls="michiru-phrase-panel" tabIndex={phrase===index?0:-1} onClick={()=>setPhrase(index)}>{item.english}</button>)}</div><div role="tabpanel" id="michiru-phrase-panel" aria-labelledby={`michiru-phrase-${phrase}`} className={styles.phrasePanel} key={phrases[phrase].english}><p lang="en">{phrases[phrase].english}</p><div><h3>{phrases[phrase].japanese}</h3><p>{phrases[phrase].note}</p></div></div></div></section>
    <section className={`${pages.nextPage} ${styles.container}`}><p>クラスを決めきれなくても、大丈夫。</p><h2>気になることから、<br/>お話ししましょう。</h2><Link href="/demo/michiru/contact">体験・お問い合わせフォームを見る<Arrow/></Link><small>制作見本のため、フォームの操作のみ体験できます。実際には送信されません。</small></section>
  </MichiruSubpageFrame>;
}
