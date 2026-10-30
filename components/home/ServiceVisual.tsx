export function ServiceVisual({ kind }: { kind: number }) {
  return <svg viewBox="0 0 360 220" fill="none" aria-hidden="true" focusable="false">
    {kind === 0 ? <>
      <circle cx="238" cy="87" r="65" fill="#F3BF58" />
      <path d="M45 183L104 128L164 175L224 124L308 184M68 183V124M287 183V139" stroke="#6B8E70" strokeWidth="2" />
      <path d="M95 65L247 45L266 180L113 198L95 65Z" fill="#FFFCF1" stroke="#224D40" strokeWidth="2.5" />
      <path d="M111 83L230 67M119 96L198 86M125 155L235 141M128 168L210 158" stroke="#95AE8C" strokeWidth="3" strokeLinecap="round" />
      <path d="M160 108C160 78 202 78 202 108C202 126 181 143 181 143C181 143 160 126 160 108Z" fill="#D68E6C" stroke="#224D40" strokeWidth="2.5" /><circle cx="181" cy="107" r="7" fill="#FFFCF1" stroke="#224D40" strokeWidth="2" />
      <rect x="49" y="35" width="172" height="41" rx="4" fill="#FFFCF1" stroke="#224D40" strokeWidth="2.5" /><circle cx="70" cy="54" r="7" stroke="#224D40" strokeWidth="2" /><path d="M75 59L81 65M99 55H197" stroke="#224D40" strokeWidth="2" strokeLinecap="round" />
    </> : kind === 1 ? <>
      <path d="M69 41H235V185H69Z" fill="#F5C968" stroke="#224D40" strokeWidth="2.5" /><path d="M69 68H235M86 54H90M99 54H103" stroke="#224D40" strokeWidth="2.5" strokeLinecap="round" />
      <rect x="88" y="86" width="129" height="66" fill="#F8F5EA" /><path d="M88 152L123 112L157 139L182 108L217 152" fill="#A8BEA0" /><circle cx="190" cy="101" r="11" fill="#D58D69" /><path d="M88 167H170" stroke="#224D40" strokeWidth="3" strokeLinecap="round" />
      <rect x="216" y="83" width="76" height="122" rx="9" fill="#FFFCF1" stroke="#224D40" strokeWidth="2.5" /><path d="M238 94H269M229 184H279" stroke="#224D40" strokeWidth="2" strokeLinecap="round" /><rect x="229" y="110" width="50" height="44" fill="#D58D69" /><path d="M230 165H278M230 173H262" stroke="#94AB8B" strokeWidth="2" strokeLinecap="round" />
      <path d="M269 37L273 49L285 53L273 57L269 69L265 57L253 53L265 49Z" fill="#224D40" />
    </> : <>
      <rect x="76" y="27" width="113" height="183" rx="13" fill="#FCF9EE" stroke="#224D40" strokeWidth="2.5" /><path d="M110 39H155M88 189H177" stroke="#224D40" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M96 65H222V106H128L111 121V106H96V65Z" fill="#B8C8AB" stroke="#224D40" strokeWidth="2" /><path d="M113 80H201M113 91H181" stroke="#55764F" strokeWidth="3" strokeLinecap="round" />
      <path d="M151 132H274V170H248L236 182V170H151V132Z" fill="#F3BF58" stroke="#224D40" strokeWidth="2" /><path d="M169 147H255M169 158H223" stroke="#8F6A2F" strokeWidth="3" strokeLinecap="round" />
      <circle cx="263" cy="69" r="22" fill="#D58D69" stroke="#224D40" strokeWidth="2" /><path d="M254 69L261 76L273 61" stroke="#FFFCF1" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </>}
  </svg>;
}
