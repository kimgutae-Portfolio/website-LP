"use client";
import Link from "next/link";
import {useEffect,useRef,useState,type FormEvent} from "react";
import {MichiruSubpageFrame} from "./MichiruSubpageFrame";
import {courses} from "./content";
import styles from "./michiru.module.css";
import pages from "./michiru-pages.module.css";

export function MichiruContactPage() {
  const [step,setStep]=useState<"input"|"confirm"|"complete">("input");
  const [course,setCourse]=useState<string>(courses[0].id);
  const [purpose,setPurpose]=useState("体験レッスンについて");
  const [agreed,setAgreed]=useState(false);
  const stage=useRef<HTMLDivElement>(null);
  const previousStep=useRef(step);
  useEffect(()=>{
    if(previousStep.current!==step){
      stage.current?.focus({preventScroll:true});
      stage.current?.scrollIntoView({block:"start",behavior:"auto"});
      previousStep.current=step;
    }
  },[step]);
  const submit=(event:FormEvent<HTMLFormElement>)=>{event.preventDefault();if(agreed)setStep("confirm");};
  const selected=courses.find(item=>item.id===course)!;
  return <MichiruSubpageFrame current="contact" revision={step}>
    <section id="michiru-page-top" className={`${pages.contactHeading} ${styles.container}`}><p className={styles.eyebrow}>YOUR FIRST HELLO.</p><h1>はじめの一歩を、<br/><span>いっしょに。</span></h1><p>英語が初めてでも、クラスを迷っていても。<br/>気になることから、お聞かせください。</p></section>
    <section className={`${pages.contactLayout} ${styles.container}`} aria-label="体験・お問い合わせフォームの制作見本"><aside className={pages.contactAside}><span>CONTACT / DESIGN SAMPLE</span><h2>体験のご相談も、<br/>教室へのご質問も。</h2><p>コース・時間割・学び方について、<br/>教室に相談する流れの見本です。</p><Link href="/demo/michiru/courses">先にコース・月謝を見る</Link><div><strong>3ページ構成の制作例</strong><p>教室の紹介と詳しいコース案内を分け、<br/>最後にお問い合わせへつなぎます。</p></div></aside>
      <div className={pages.formArea}><div className={pages.demoAlert}><strong>送信されない、フォームの操作見本です。</strong><p>個人情報は入力しないでください。名前・メール・本文は変更できないサンプルです。メール送信・予約・保存は行いません。</p></div>
      <div className={pages.formStages} aria-label="現在の表示"><span aria-current={step==="input"?"step":undefined}>内容の入力</span><span aria-current={step==="confirm"?"step":undefined}>ご確認</span><span aria-current={step==="complete"?"step":undefined}>完了</span></div>
      <div ref={stage} tabIndex={-1} className={pages.formStage} data-clarity-mask="true" aria-live="polite">
      {step==="input"&&<form onSubmit={submit} data-demo-contact-form data-clarity-mask="true"><div className={pages.field}><label htmlFor="michiru-purpose">ご相談内容<span>選択できます</span></label><select id="michiru-purpose" value={purpose} onChange={event=>setPurpose(event.target.value)}><option>体験レッスンについて</option><option>コース・月謝について</option><option>教室についてのご質問</option></select></div><div className={pages.field}><label htmlFor="michiru-course">気になるコース<span>選択できます</span></label><select id="michiru-course" value={course} onChange={event=>setCourse(event.target.value)}>{courses.map(item=><option value={item.id} key={item.id}>{item.age} / {item.name}</option>)}</select></div><div className={pages.field}><label htmlFor="michiru-name">保護者のお名前<span>サンプル・変更不要</span></label><input id="michiru-name" value="保護者さま（サンプル）" readOnly autoComplete="off"/></div><div className={pages.field}><label htmlFor="michiru-email">メールアドレス<span>サンプル・変更不要</span></label><input id="michiru-email" type="email" value="sample@example.com" readOnly autoComplete="off"/></div><div className={pages.field}><label htmlFor="michiru-message">メッセージ<span>サンプル・変更不要</span></label><textarea id="michiru-message" rows={4} value="英語が初めてなので、教室の雰囲気や体験レッスンについて相談したいです。" readOnly/></div><label className={pages.agreement}><input type="checkbox" checked={agreed} onChange={event=>setAgreed(event.target.checked)} required/><span>制作見本のため、実際には送信されないことを確認しました。</span></label><button className={pages.submit} type="submit" disabled={!agreed}>内容を確認する（デモ）</button></form>}
      {step==="confirm"&&<div><h2>こちらの内容で、<br/>お送りする見本です。</h2><dl className={pages.confirmation}>{[["ご相談内容",purpose],["気になるコース",`${selected.age} / ${selected.name}`],["お名前","保護者さま（サンプル）"],["メール","sample@example.com"],["メッセージ","英語が初めてなので、教室の雰囲気や体験レッスンについて相談したいです。"]].map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl><p className={pages.noSend}>ボタンを押してもメール送信・予約確定は行われません。</p><button type="button" className={pages.submit} onClick={()=>setStep("complete")}>送信完了の表示を体験する</button><button type="button" className={pages.back} onClick={()=>setStep("input")}>入力内容に戻る</button></div>}
      {step==="complete"&&<div className={pages.complete}><span>THANK YOU FOR TRYING.</span><h2>はじめの一歩が、<br/>届くホームページに。</h2><p>フォームの操作体験が完了しました。<br/>実際のメール送信・体験予約・個人情報の保存は行っていません。</p><p>実制作では、教室のメールアドレスへの通知や迷惑送信対策を含めた標準フォームを実装します。</p><Link className={pages.submit} href="/#contact">このホームページの制作を相談する</Link><button type="button" className={pages.back} onClick={()=>{setStep("input");setAgreed(false);}}>もう一度フォームを見る</button><Link className={pages.back} href="/demo/michiru">みちるのトップへ戻る</Link></div>}
      </div></div>
    </section>
  </MichiruSubpageFrame>;
}
