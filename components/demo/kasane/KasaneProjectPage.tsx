"use client";
import Image from "next/image";
import Link from "next/link";
import {DemoNotice,DemoShell} from "../shared/PremiumDemo";
import {kasaneProjects} from "./content";
import {projectStories} from "./project-stories";
import styles from "./project-page.module.css";

export function KasaneProjectPage({slug}:{slug:keyof typeof projectStories}) {
  const project=kasaneProjects.find(item=>item.id===slug)!;
  const story=projectStories[slug];
  const next=kasaneProjects.find(item=>item.id!==slug)!;
  return <DemoShell className={styles.site}>
    <div className={styles.demoBar}><span>KASANE / PROJECT STORIES</span><Link href="/#demo">まちのWebへ戻る</Link></div>
    <header className={styles.header}><Link href="/demo/kasane" className={styles.brand}>KASANE<small>株式会社かさね</small></Link><Link href="/demo/kasane#kasane-projects">プロジェクト一覧</Link><Link href="/demo/kasane#kasane-contact">空間のご相談</Link></header>
    <main><nav className={styles.breadcrumbs} aria-label="パンくずリスト"><Link href="/demo/kasane">TOP</Link><span>/</span><Link href="/demo/kasane#kasane-projects">PROJECTS</Link><span>/</span><span aria-current="page">{project.name}</span></nav>
      <section className={styles.title}><div><p>PROJECT STORY / {project.number}</p><h1>{project.title}</h1><span>{project.name}</span></div><div><p>{project.category}</p><p>{project.scope}</p><small>FICTIONAL DESIGN PROPOSAL / {project.year}</small></div></section>
      <div className={styles.hero}><Image src={project.image} alt={project.alt} fill sizes="100vw" priority data-hero-image/><span>{project.location} / ARCHITECTURAL IMAGE</span></div>
      <section className={styles.intro}><div data-demo-reveal><p className={styles.eyebrow}>THE IDEA BEHIND THE SPACE</p><h2>{story.lead.split("\n").map((line,i)=><span key={i}>{line}</span>)}</h2></div><div data-demo-reveal><p className={styles.lead}>{story.brief}</p><dl><div><dt>PROJECT</dt><dd>{project.name}</dd></div><div><dt>LOCATION</dt><dd>{project.location}</dd></div><div><dt>SCOPE</dt><dd>{project.scope}</dd></div></dl><small>実際の施工実績ではなく、設計の考え方を伝える架空の提案です。</small></div></section>
      <section className={styles.story}><div className={styles.storyPhoto} data-demo-reveal><Image src={story.secondary} alt={story.secondaryAlt} fill sizes="(max-width:700px) 100vw,60vw"/></div><div className={styles.storyCopy}><article data-demo-reveal><p>問い / THE QUESTION</p><h2>どんな時間を、つくるか。</h2><p>{story.challenge}</p></article><article data-demo-reveal><p>かたち / OUR RESPONSE</p><h2>素材と、余白で応える。</h2><p>{story.response}</p></article></div></section>
      <section className={styles.details}><div className={styles.detailsTitle}><p className={styles.eyebrow}>SMALL DETAILS, SHARED VALUES.</p><h2>心地よさは、<br/>小さな選択から。</h2></div><div>{story.details.map(([title,text],i)=><article key={title} data-demo-reveal><span>0{i+1}</span><div><h3>{title}</h3><p>{text}</p></div></article>)}</div></section>
      <section className={styles.materials} aria-label="素材のパレット"><p>MATERIAL NOTES</p>{story.materials.map(item=><div key={item.name}><span style={{background:item.color}}/><div><strong>{item.name}</strong><small>{item.japanese}</small></div></div>)}</section>
      <section className={styles.next}><div><p>NEXT PROJECT</p><h2>{next.title}</h2><Link href={`/demo/kasane/projects/${next.id}`}>{next.name} のストーリーを読む</Link></div><Link href={`/demo/kasane/projects/${next.id}`} aria-label={`${next.name}の詳細を見る`}><Image src={next.image} alt={next.alt} fill sizes="(max-width:700px) 100vw,50vw"/></Link></section>
      <div className={styles.consult}><p>つくりたい場所のことから。</p><Link href="/demo/kasane#kasane-contact">KASANEに相談する</Link><small>制作見本のため、実際の設計相談は受け付けていません。</small></div>
    </main><footer className={styles.footer}><Link href="/demo/kasane">KASANE / TOP</Link><DemoNotice/></footer>
  </DemoShell>;
}
