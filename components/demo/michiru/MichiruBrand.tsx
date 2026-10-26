import styles from "./michiru.module.css";
export function MichiruBrand() {
  return <span className={styles.brand}><svg width="38" height="38" viewBox="0 0 38 38" fill="none" aria-hidden="true"><path d="M5 29V16c0-8 13-8 13 0v13-13c0-8 14-8 14 0v13" stroke="currentColor" strokeWidth="4.5"/><circle cx="32" cy="6" r="4" fill="#f5cd52"/></svg><span>みちる<small>英語教室 / MICHIRU</small></span></span>;
}
