import styles from "./hero.module.css";

/** Code-native brand illustration; storefronts are decorative, not client work. */
export function TownScene({ onEntryEnd }: { onEntryEnd?: () => void }) {
  return <svg viewBox="0 0 900 620" fill="none" aria-hidden="true" focusable="false">
    <g className={styles.sceneCamera} data-entry-camera onAnimationEnd={event => { if (event.target === event.currentTarget) onEntryEnd?.(); }}>
      <g className={styles.sunrise} data-entry-sun>
        <circle cx="642" cy="164" r="112" fill="#F4BD4F" />
        <path d="M642 27V9M740 67L754 53M781 164H800M543 67L529 53M505 164H486" stroke="#DDA33C" strokeWidth="3" strokeLinecap="round" />
      </g>
      <path d="M98 161H216M75 174H157M708 76H806M754 90H828" stroke="#D4DCD1" strokeWidth="3" strokeLinecap="round" />
      <path d="M18 534C165 514 255 534 390 524C556 512 698 526 880 504" stroke="#214E42" strokeWidth="3" strokeLinecap="round" />
      <path d="M43 568H801M185 586H864" stroke="#CFD8CB" strokeWidth="2" strokeLinecap="round" />
      <g stroke="#214E42" strokeWidth="3" strokeLinejoin="round">
        <path d="M61 520V302L120 244H255V521" fill="#E8EBCF" /><path d="M61 302H255M120 244V302" />
        <path d="M83 342H231V418H83Z" fill="#FFFCF2" /><path d="M157 342V418M83 380H231" />
        <path d="M83 462H230V520H83Z" fill="#D5DDD0" /><path d="M99 477H214M99 491H214M99 505H214" strokeWidth="2" />
        <path d="M295 519V185H558V519" fill="#FCF9EF" /><path d="M281 185L425 105L573 185H281Z" fill="#295849" />
        <path d="M324 209H530V258H324Z" fill="#F3BE55" />
        <path d="M304 284H549L568 331H285L304 284Z" fill="#FCF9EF" />
        <path d="M304 284H337L325 331H285L304 284ZM370 284H403L399 331H362L370 284ZM435 284H468L473 331H436L435 284ZM501 284H533L568 331H525L501 284Z" fill="#A7B6A0" stroke="none" />
        <path d="M285 331H568M310 347H396V488H310Z" fill="#D7E2D4" /><path d="M353 347V488M310 418H396" strokeWidth="2" />
        <g data-entry-doorway>
          <path d="M415 347H537V519H415Z" fill="#F7CD78" />
          <g className={styles.doorLeft}><path d="M416 348H476V519H416Z" fill="#E8ECDB" /><path d="M427 360H463V454H427Z" fill="#B3C6B5" /><path d="M465 477V489" strokeWidth="4" /></g>
          <g className={styles.doorRight}><path d="M476 348H536V519H476Z" fill="#D3DED0" /><path d="M489 360H525V454H489Z" fill="#B3C6B5" /><path d="M487 477V489" strokeWidth="4" /></g>
        </g>
        <path d="M406 519H547V530H406Z" fill="#214E42" />
        <path d="M604 519V277H794V518" fill="#D69270" /><path d="M592 277H807V292H592Z" fill="#FCF9EF" />
        <path d="M625 312H773V352H625Z" fill="#FFFCF2" /><path d="M626 377H688V519H626Z" fill="#E5E8D6" />
        <path d="M638 390H675V459H638Z" fill="#B5C6B5" /><path d="M675 481V491" />
        <path d="M711 377H774V466H711Z" fill="#F9E7C4" /><path d="M711 421H774" strokeWidth="2" />
        <path d="M811 520V403M811 446L829 425M811 463L792 441" strokeWidth="4" strokeLinecap="round" />
        <path d="M812 428C765 437 771 388 801 392C779 356 827 336 838 375C871 352 891 403 851 416C854 447 823 451 812 428Z" fill="#A4B69B" />
        <path d="M800 504H831L826 532H805L800 504Z" fill="#F3BE55" />
        <path d="M267 519V456M267 484C242 480 244 456 264 459M269 475C292 476 294 452 272 453" strokeLinecap="round" />
        <path d="M251 500H284L279 525H257L251 500Z" fill="#D69270" />
      </g>
      <g fill="#214E42" fontFamily="inherit" fontWeight="900" textAnchor="middle">
        <text x="157" y="327" fontSize="16" letterSpacing="3">COFFEE</text>
        <text x="427" y="242" fontSize="22" letterSpacing="4">まちの商店</text>
        <text x="699" y="339" fontSize="19" letterSpacing="4">ATELIER</text>
      </g>
      <g transform="translate(348 445) rotate(-7)"><path d="M-26-17H26V17H-26Z" fill="#FCF9EF" stroke="#214E42" strokeWidth="2" /><text y="5" fill="#214E42" fontFamily="inherit" fontSize="14" fontWeight="900" textAnchor="middle">OPEN</text></g>
      <g transform="translate(117 170) rotate(-7)"><rect width="205" height="50" rx="3" fill="#FFFCF4" stroke="#214E42" strokeWidth="2" /><path d="M172 50L185 66V50" fill="#FFFCF4" stroke="#214E42" strokeWidth="2" /><text x="102" y="32" textAnchor="middle" fill="#214E42" fontFamily="inherit" fontWeight="700" fontSize="18">まちに、Webの入口を。</text></g>
      <g stroke="#214E42" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="130" cy="538" r="23" fill="#F8F5EA" /><circle cx="214" cy="538" r="23" fill="#F8F5EA" /><path d="M130 538L155 500L181 538H130L163 514H198M181 538L198 491H208M147 498H165" /></g>
      <path d="M58 111L61 121L71 124L61 127L58 137L55 127L45 124L55 121Z" fill="#D69270" /><path d="M811 209L815 223L829 227L815 231L811 245L807 231L793 227L807 223Z" fill="#214E42" />
    </g>
  </svg>;
}
