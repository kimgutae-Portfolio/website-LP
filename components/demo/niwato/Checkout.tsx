"use client";
import { useEffect, useRef, useState } from "react";
import { Arrow, DemoDialog } from "../shared/PremiumDemo";
import { getQuote, yen, type CarePlan, type LawnArea } from "./content";
import styles from "./niwato.module.css";

export function Checkout({open,onClose,area,plan}:{open:boolean;onClose:()=>void;area:LawnArea;plan:CarePlan}) {
  const [agreed,setAgreed] = useState(false);
  const [complete,setComplete] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const quote = getQuote(area,plan);
  useEffect(()=>{if(open){setAgreed(false);setComplete(false);}},[open]);
  useEffect(()=>{if(complete)heading.current?.focus();},[complete]);
  return <DemoDialog open={open} onClose={onClose} label="NIWATO / SUBSCRIPTION DEMO" className={styles.checkoutDialog}>
    {complete?<div className={styles.complete}>
      <div className={styles.completeMark} aria-hidden="true"><svg viewBox="0 0 80 80"><path d="M23 41l12 12 24-27" fill="none" stroke="currentColor" strokeWidth="3"/><circle cx="40" cy="40" r="37" fill="none" stroke="currentColor"/></svg></div>
      <p className={styles.eyebrow}>THANK YOU — DEMO COMPLETE</p><h2 ref={heading} tabIndex={-1}>庭のいい日が、<br/>はじまる予感。</h2>
      <p>月額お申し込みの体験が完了しました。</p>
      <div className={styles.successNote}><strong>決済・契約は発生していません。</strong><p>訪問の手配やメール送信も行われません。<br/>これは、購入の流れを確認するためのデモです。</p></div>
      <dl className={styles.receipt}><div><dt>体験したプラン</dt><dd>{quote.name} / 月{quote.visits}回</dd></div><div><dt>芝生の広さ</dt><dd>{area}㎡まで</dd></div><div><dt>月額の表示例</dt><dd>¥{yen(quote.total)}（税込）</dd></div></dl>
      <button type="button" className={styles.solidButton} onClick={onClose}>サイトに戻る<Arrow/></button>
    </div>:<div className={styles.checkout}>
      <div className={styles.checkoutHeading}><p className={styles.eyebrow}>YOUR GARDEN, EVERY MONTH.</p><h2>お庭の定期便を、<br/>はじめましょう。</h2><p className={styles.checkoutNotice}>お申し込み画面のデモです。実際の決済はありません。<br/>個人情報・本物のカード情報は入力しないでください。</p></div>
      <div className={styles.checkoutLayout}><div>
        <section className={styles.orderSummary} aria-labelledby="niwato-order-heading"><h3 id="niwato-order-heading">選んだ定期ケア</h3><div className={styles.orderTitle}><span>{quote.name}<small>芝生 {area}㎡まで / 月{quote.visits}回訪問</small></span><a href="#niwato-plans" onClick={onClose}>変更</a></div><dl><div><dt>月額サービス料金（税込）</dt><dd>¥{yen(quote.total)}</dd></div><div><dt>初期費用（デモ設定）</dt><dd>¥0</dd></div><div className={styles.orderTotal}><dt>毎月のお支払い</dt><dd>¥{yen(quote.total)}<small> / 月</small></dd></div></dl><p>芝刈り・際の仕上げ・集草・通常量の刈り草回収を含みます。初回の大規模整備等は対象外です。</p></section>
        <section className={styles.demoPayment} aria-labelledby="niwato-payment-heading"><div className={styles.paymentHeading}><h3 id="niwato-payment-heading">お支払い方法</h3><span>CARD / 月額自動更新の表示例</span></div><div className={styles.demoCard} aria-label="入力不要のサンプルカード、末尾4242"><div><span>NIWATO</span><span>DEMO CARD</span></div><span className={styles.cardChip} aria-hidden="true"/><p>••••　••••　••••　4242</p><div><span>SAMPLE MEMBER</span><span>12 / 30</span></div></div><p className={styles.paymentNote}>入力不要のサンプルカードです。<br/>カード情報の取得・保存・送信は一切行いません。</p></section>
      </div><div className={styles.checkoutAction}>
        <p className={styles.eyebrow}>MONTHLY SUBSCRIPTION</p><div className={styles.checkoutPrice}>¥{yen(quote.total)}<small>/ 月・税込</small></div>
        <dl className={styles.billingTerms}><div><dt>契約期間</dt><dd>1か月ごとの自動更新</dd></div><div><dt>請求タイミング</dt><dd>開始日、以降毎月同日（設定例）</dd></div><div><dt>最低利用期間</dt><dd>なし（設定例）</dd></div><div><dt>解約・変更</dt><dd>次回更新日の7日前までに連絡</dd></div></dl>
        <details className={styles.demoTerms}><summary>デモのサービス条件を見る ＋</summary><p>本ページは架空のサービスの制作見本です。対象は平坦な住宅の芝生で、表示面積までの通常のお手入れを想定しています。雨天は日程調整。芝の張り替え、樹木剪定、薬剤散布、大規模な初回整備は対象外。冬は清掃・状態確認等に切り替え、選択回数で訪問する設定です。条件は実際の販売条件・法的文書ではありません。</p></details>
        <label className={styles.agreement}><input type="checkbox" checked={agreed} onChange={event=>setAgreed(event.target.checked)}/><span>料金・更新条件を確認し、課金されないデモであることを理解しました。</span></label>
        <button type="button" className={styles.solidButton} disabled={!agreed} onClick={()=>setComplete(true)}>月額契約を体験する<Arrow/></button><p className={styles.noCharge}>デモ専用 / 実際のお支払いは ¥0</p>
      </div></div>
    </div>}
  </DemoDialog>;
}
