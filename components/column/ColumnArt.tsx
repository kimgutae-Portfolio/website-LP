import type { ColumnArticle } from "@/content/columns";
import styles from "./column.module.css";

// Repository-native editorial illustrations: deliberately no stock faces or decorative motion.
export function ColumnArt({ article, compact = false }: { article: ColumnArticle; compact?: boolean }) {
  return <div className={`${styles.art} ${compact ? styles.compactArt : ""}`} data-theme={article.theme} aria-hidden="true">
    <div className={styles.artCopy}><span>まちのWebの読みもの</span><p>{article.coverCopy[0]}<br/>{article.coverCopy[1]}</p><span className={styles.artRule}/></div>
    <svg viewBox="0 0 320 240" fill="none" focusable="false" className={styles.illustration}>
      <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {article.theme === "home" && <>
          <path d="M28 208H294M56 106V207H253V106"/><path d="M45 106L61 63H247L265 106H45Z" fill="var(--art-fill)"/>
          <path d="M88 64L80 106M123 64L119 106M158 64V106M194 64L198 106M228 64L237 106"/>
          <path d="M91 207V134H151V207M169 133H233V179H169Z" fill="var(--art-paper)"/><path d="M200 134V178M113 166H118"/>
          <path d="M72 53V35H238V53"/><path d="M124 43H186"/><path d="M42 201L39 172H64L60 201M51 171C33 163 35 148 40 145C51 145 56 160 51 171ZM52 169C67 160 74 148 66 142C55 144 51 159 52 169Z" fill="var(--art-fill)"/>
          <rect x="214" y="149" width="64" height="84" rx="5" fill="var(--art-paper)"/><path d="M223 164H269M224 175H254M224 191H269M241 221H251"/><path d="M226 133L237 121M265 133L276 121M249 127V110"/>
        </>}
        {article.theme === "prepare" && <>
          <path d="M30 208H290"/><path d="M67 46L235 32L249 209L81 223L67 46Z" fill="var(--art-fill)"/>
          <rect x="83" y="40" width="163" height="178" rx="3" fill="var(--art-paper)"/>
          <path d="M120 41V29H205V52H120V41Z" fill="var(--art-fill)"/>
          <path d="M111 84H218M111 105H188M111 154H217M111 174H203M111 194H170"/>
          <path d="M111 125L118 132L132 116M146 126H213"/>
          <path d="M235 165L275 66L285 70L244 170L235 180V165Z" fill="var(--art-fill)"/>
          <path d="M273 70L282 74M235 165L244 170M37 131L48 125L67 157L55 164L37 131Z" fill="var(--art-paper)"/>
          <path d="M39 131L44 116L48 125M55 164L67 157L71 164L59 171L55 164Z"/>
        </>}
        {article.theme === "cost" && <>
          <path d="M24 213H297"/><path d="M53 67L169 52L185 200L70 213L53 67Z" fill="var(--art-fill)"/>
          <path d="M67 48H174V202L162 194L151 202L139 194L127 202L115 194L103 202L91 194L79 202L67 194V48Z" fill="var(--art-paper)"/>
          <path d="M85 76H154M85 94H138M85 138H154M85 156H154M85 173H128"/>
          <path d="M182 98H268V202L257 195L246 202L235 195L224 202L213 195L202 202L191 195L182 202V98Z" fill="var(--art-fill)"/>
          <path d="M199 121H250M199 140H238M199 161H250M199 179H231"/>
          <circle cx="231" cy="57" r="28" fill="var(--art-paper)"/><path d="M216 51H245M218 60H242M221 39L231 51L241 39M231 51V73"/>
          <path d="M37 101V120M29 111H46M282 63V78M275 70H289"/>
        </>}
        {article.theme === "find" && <>
          <path d="M33 87L112 66L208 83L287 61V198L208 220L112 202L33 223V87Z" fill="var(--art-paper)"/>
          <path d="M112 67V201M208 84V218"/><path d="M35 156L111 132L207 153L286 127M73 77V142L110 170L156 163L180 175L207 184L285 162" stroke="var(--art-line)" strokeWidth="11"/>
          <path d="M71 77V142L110 170L156 163L180 175L207 184L285 162" strokeWidth="1.5"/>
          <path d="M164 143C149 124 125 99 125 74C125 52 142 35 164 35C186 35 203 52 203 74C203 99 180 126 164 143Z" fill="var(--art-fill)"/>
          <circle cx="164" cy="73" r="13" fill="var(--art-paper)"/><circle cx="92" cy="184" r="7" fill="var(--art-fill)"/>
          <path d="M96 178L137 154" strokeDasharray="3 7"/><path d="M230 39H267M248 21V57"/>
        </>}
        {article.theme === "care" && <>
          <path d="M27 211H295"/><rect x="42" y="48" width="182" height="138" rx="4" fill="var(--art-paper)"/>
          <path d="M42 72H224M57 60H59M68 60H70M79 60H81"/><path d="M61 92H127V142H61Z" fill="var(--art-fill)"/>
          <path d="M144 95H205M144 110H194M144 127H202M61 159H199M61 170H163M107 186V207M162 186V207M89 208H179"/>
          <path d="M236 168V89M236 133C216 128 211 111 218 102C232 105 240 118 236 133ZM237 113C257 109 265 95 257 85C242 88 234 99 237 113ZM237 157C257 157 272 143 266 131C250 129 237 140 237 157Z" fill="var(--art-fill)"/>
          <path d="M215 168H263L257 211H222L215 168Z" fill="var(--art-fill)"/><path d="M211 169H267M269 55L275 46M283 67L294 63M252 40V30"/>
        </>}
      </g>
    </svg>
  </div>;
}
