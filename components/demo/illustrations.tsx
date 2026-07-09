/**
 * 데모 사이트용 플랫 스타일 SVG 일러스트 모음
 * 사진 대신 각 데모의 팔레트에 맞춘 장식 일러스트 (전부 decorative → aria-hidden)
 * preserveAspectRatio="xMidYMid slice" 로 사진처럼 컨테이너를 가득 채움
 */

type IllustProps = { className?: string };

const svgProps = {
  preserveAspectRatio: "xMidYMid slice",
  "aria-hidden": true,
  role: "presentation",
} as const;

/* ------------------------------------------------------------
 * のぞみ（介護施設）: 시설 건물 + 송영차 + 맑은 하늘
 * ---------------------------------------------------------- */
export function NozomiHeroIllust({ className = "" }: IllustProps) {
  return (
    <svg viewBox="0 0 800 450" className={className} {...svgProps}>
      <rect width="800" height="450" fill="#dceefb" />
      <circle cx="690" cy="78" r="42" fill="#fde68a" />
      <g fill="#ffffff" opacity="0.9">
        <ellipse cx="150" cy="72" rx="62" ry="20" />
        <ellipse cx="205" cy="88" rx="44" ry="16" />
        <ellipse cx="520" cy="105" rx="50" ry="17" />
      </g>
      <rect y="330" width="800" height="120" fill="#bee3c8" />
      <rect y="392" width="800" height="58" fill="#d8e9d3" />
      {/* 건물 */}
      <rect x="140" y="172" width="380" height="158" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="3" />
      <rect x="124" y="136" width="412" height="44" rx="10" fill="#0284c7" />
      <text x="330" y="166" textAnchor="middle" fill="#ffffff" fontSize="24" fontWeight="700">
        デイサービスのぞみ
      </text>
      <rect x="310" y="238" width="62" height="92" rx="4" fill="#7dd3fc" stroke="#38bdf8" strokeWidth="3" />
      <line x1="341" y1="238" x2="341" y2="330" stroke="#38bdf8" strokeWidth="3" />
      <g fill="#bae6fd" stroke="#7dd3fc" strokeWidth="3">
        <rect x="178" y="210" width="74" height="58" rx="4" />
        <rect x="428" y="210" width="74" height="58" rx="4" />
      </g>
      <g stroke="#7dd3fc" strokeWidth="2.5">
        <line x1="215" y1="210" x2="215" y2="268" />
        <line x1="178" y1="239" x2="252" y2="239" />
        <line x1="465" y1="210" x2="465" y2="268" />
        <line x1="428" y1="239" x2="502" y2="239" />
      </g>
      {/* 슬로프(경사로) + 난간 — 배리어프리 소구 */}
      <polygon points="308,330 210,330 308,302" fill="#cbd5e1" />
      <line x1="218" y1="318" x2="306" y2="292" stroke="#64748b" strokeWidth="4" strokeLinecap="round" />
      <g stroke="#64748b" strokeWidth="3">
        <line x1="240" y1="312" x2="240" y2="326" />
        <line x1="270" y1="303" x2="270" y2="322" />
        <line x1="300" y1="294" x2="300" y2="316" />
      </g>
      {/* 송영차 */}
      <rect x="578" y="248" width="172" height="72" rx="16" fill="#38bdf8" />
      <rect x="594" y="262" width="54" height="28" rx="6" fill="#e0f2fe" />
      <rect x="658" y="262" width="54" height="28" rx="6" fill="#e0f2fe" />
      <text x="664" y="312" textAnchor="middle" fill="#ffffff" fontSize="17" fontWeight="700">
        送迎車
      </text>
      <circle cx="614" cy="324" r="15" fill="#334155" />
      <circle cx="614" cy="324" r="6" fill="#94a3b8" />
      <circle cx="714" cy="324" r="15" fill="#334155" />
      <circle cx="714" cy="324" r="6" fill="#94a3b8" />
      {/* 나무 */}
      <rect x="84" y="268" width="14" height="62" rx="4" fill="#a16207" />
      <circle cx="91" cy="244" r="36" fill="#4ade80" />
      <circle cx="66" cy="262" r="22" fill="#86efac" />
      <circle cx="116" cy="262" r="22" fill="#86efac" />
      <ellipse cx="555" cy="330" rx="30" ry="16" fill="#86efac" />
    </svg>
  );
}

/* ------------------------------------------------------------
 * LUCE（美容室）: 거울·체어·펜던트 조명이 있는 살롱 내부
 * ---------------------------------------------------------- */
export function LuceHeroIllust({ className = "" }: IllustProps) {
  return (
    <svg viewBox="0 0 800 450" className={className} {...svgProps}>
      <rect width="800" height="450" fill="#f6f0e8" />
      <rect y="340" width="800" height="110" fill="#eadfce" />
      <line x1="0" y1="340" x2="800" y2="340" stroke="#dccfb8" strokeWidth="3" />
      {/* 창문 */}
      <rect x="580" y="88" width="150" height="214" rx="14" fill="#fdf8ee" stroke="#d6c7b0" strokeWidth="4" />
      <line x1="655" y1="88" x2="655" y2="302" stroke="#d6c7b0" strokeWidth="3" />
      <line x1="580" y1="196" x2="730" y2="196" stroke="#d6c7b0" strokeWidth="3" />
      {/* 펜던트 조명 */}
      <g>
        <line x1="160" y1="0" x2="160" y2="66" stroke="#8c8377" strokeWidth="3" />
        <path d="M133 66 h54 l-11 30 h-32 z" fill="#cf9184" />
        <circle cx="160" cy="104" r="7" fill="#fcd34d" />
      </g>
      <g>
        <line x1="700" y1="0" x2="700" y2="40" stroke="#8c8377" strokeWidth="3" />
        <path d="M673 40 h54 l-11 30 h-32 z" fill="#cf9184" />
        <circle cx="700" cy="78" r="7" fill="#fcd34d" />
      </g>
      {/* 거울 + 카운터 */}
      <ellipse cx="300" cy="190" rx="86" ry="112" fill="#fdfbf7" stroke="#c9a86a" strokeWidth="7" />
      <path d="M258 128 q-20 34 -12 78" stroke="#e8dfd0" strokeWidth="8" fill="none" strokeLinecap="round" />
      <rect x="196" y="304" width="208" height="16" rx="8" fill="#d3b98a" />
      <g>
        <rect x="222" y="272" width="16" height="32" rx="5" fill="#cf9184" />
        <rect x="246" y="262" width="14" height="42" rx="5" fill="#a3b899" />
        <rect x="268" y="278" width="16" height="26" rx="5" fill="#c9a86a" />
        <rect x="350" y="268" width="15" height="36" rx="5" fill="#b8a5c9" />
      </g>
      <rect x="212" y="320" width="12" height="20" fill="#b09a72" />
      <rect x="376" y="320" width="12" height="20" fill="#b09a72" />
      {/* 살롱 체어 */}
      <rect x="452" y="252" width="104" height="28" rx="14" fill="#4a4038" />
      <rect x="530" y="178" width="24" height="92" rx="11" fill="#4a4038" />
      <rect x="497" y="280" width="12" height="52" fill="#8c8377" />
      <ellipse cx="503" cy="338" rx="46" ry="10" fill="#8c8377" />
      {/* 화분 */}
      <rect x="66" y="288" width="58" height="50" rx="9" fill="#b57f6a" />
      <g fill="#7fa877">
        <ellipse cx="95" cy="252" rx="14" ry="34" />
        <ellipse cx="70" cy="258" rx="12" ry="28" transform="rotate(-24 70 258)" />
        <ellipse cx="120" cy="258" rx="12" ry="28" transform="rotate(24 120 258)" />
      </g>
    </svg>
  );
}

/* LUCE: 스타일리스트 아바타 (원형) */
export function LuceStylistIllust({ className = "" }: IllustProps) {
  return (
    <svg viewBox="0 0 200 200" className={className} {...svgProps}>
      <rect width="200" height="200" fill="#f3e0d8" />
      <path d="M42 200 v-16 q58 -56 116 0 v16 z" fill="#cf9184" />
      <rect x="89" y="116" width="22" height="26" fill="#f2c9a8" />
      <circle cx="100" cy="94" r="39" fill="#f6d3b3" />
      <path
        d="M55 94 q0 -54 45 -54 q45 0 45 54 q0 16 -9 24 q5 -36 -36 -36 q-41 0 -36 36 q-9 -8 -9 -24 z"
        fill="#5b4436"
      />
      <circle cx="100" cy="36" r="16" fill="#5b4436" />
      <circle cx="86" cy="96" r="3.4" fill="#3f2f26" />
      <circle cx="114" cy="96" r="3.4" fill="#3f2f26" />
      <path d="M92 111 q8 7 16 0" stroke="#b3766a" strokeWidth="3" fill="none" strokeLinecap="round" />
      <circle cx="76" cy="106" r="5.5" fill="#f0b1a0" opacity="0.55" />
      <circle cx="124" cy="106" r="5.5" fill="#f0b1a0" opacity="0.55" />
    </svg>
  );
}

/* ------------------------------------------------------------
 * 吉田（飲食店）: 생선구이 정식 + 젓가락 + 술병
 * ---------------------------------------------------------- */
export function MarutaHeroIllust({ className = "" }: IllustProps) {
  return (
    <svg viewBox="0 0 800 450" className={className} {...svgProps}>
      <rect width="800" height="450" fill="#26211d" />
      <rect y="300" width="800" height="150" fill="#3d3128" />
      <g stroke="#4c3e31" strokeWidth="3">
        <line x1="0" y1="345" x2="800" y2="345" />
        <line x1="0" y1="396" x2="800" y2="396" />
      </g>
      {/* 김이 오르는 연출 */}
      <g stroke="#9aa3ad" strokeWidth="5" fill="none" opacity="0.55" strokeLinecap="round">
        <path d="M330 235 q-16 -30 0 -56 q16 -26 0 -52" />
        <path d="M420 245 q-16 -30 0 -56 q16 -26 0 -52" />
      </g>
      {/* 접시 + 생선 */}
      <ellipse cx="400" cy="330" rx="235" ry="58" fill="#37424e" />
      <ellipse cx="400" cy="324" rx="210" ry="46" fill="#46525f" />
      <ellipse cx="385" cy="312" rx="148" ry="36" fill="#c98850" />
      <path d="M528 312 l74 -32 l-17 32 l17 32 z" fill="#b5773f" />
      <circle cx="268" cy="304" r="5.5" fill="#26211d" />
      <g stroke="#7c4a22" strokeWidth="5" strokeLinecap="round" fill="none">
        <path d="M330 284 q6 28 0 54" />
        <path d="M380 282 q6 30 0 58" />
        <path d="M430 284 q6 28 0 54" />
        <path d="M478 288 q5 24 0 46" />
      </g>
      {/* 레몬 */}
      <circle cx="248" cy="348" r="23" fill="#fbbf24" />
      <circle cx="248" cy="348" r="17" fill="#fde68a" />
      <g stroke="#f59e0b" strokeWidth="2.5">
        <line x1="248" y1="331" x2="248" y2="365" />
        <line x1="231" y1="348" x2="265" y2="348" />
        <line x1="236" y1="336" x2="260" y2="360" />
        <line x1="260" y1="336" x2="236" y2="360" />
      </g>
      {/* 젓가락 */}
      <line x1="565" y1="392" x2="745" y2="310" stroke="#a16207" strokeWidth="8" strokeLinecap="round" />
      <line x1="578" y1="404" x2="758" y2="322" stroke="#b45309" strokeWidth="8" strokeLinecap="round" />
      {/* 도쿠리(술병)와 잔 */}
      <path d="M96 322 q-4 -46 22 -58 q-8 -14 0 -24 h20 q8 10 0 24 q26 12 22 58 z" fill="#e7e5e4" />
      <ellipse cx="128" cy="322" rx="32" ry="8" fill="#d6d3d1" />
      <rect x="176" y="300" width="34" height="24" rx="6" fill="#e7e5e4" />
      <ellipse cx="193" cy="300" rx="17" ry="5" fill="#a8a29e" />
    </svg>
  );
}

/* 吉田: 메뉴 카드용 요리 일러스트 3종 */
export function MarutaDishIllust({
  dish,
  className = "",
}: IllustProps & { dish: "fish" | "tamago" | "rice" }) {
  return (
    <svg viewBox="0 0 300 200" className={className} {...svgProps}>
      <rect width="300" height="200" fill="#3a332c" />
      {dish === "fish" && (
        <g>
          <g stroke="#9aa3ad" strokeWidth="4" fill="none" opacity="0.5" strokeLinecap="round">
            <path d="M120 74 q-10 -20 0 -38" />
            <path d="M175 78 q-10 -20 0 -38" />
          </g>
          <rect x="55" y="138" width="190" height="16" rx="8" fill="#57534e" />
          <rect x="70" y="158" width="12" height="14" fill="#57534e" />
          <rect x="218" y="158" width="12" height="14" fill="#57534e" />
          <ellipse cx="140" cy="112" rx="72" ry="22" fill="#c98850" />
          <path d="M210 112 l38 -18 l-9 18 l9 18 z" fill="#b5773f" />
          <circle cx="84" cy="107" r="3.6" fill="#26211d" />
          <g stroke="#7c4a22" strokeWidth="4" strokeLinecap="round" fill="none">
            <path d="M115 96 q4 16 0 32" />
            <path d="M145 94 q4 18 0 36" />
            <path d="M175 96 q4 16 0 30" />
          </g>
        </g>
      )}
      {dish === "tamago" && (
        <g>
          <ellipse cx="150" cy="152" rx="98" ry="20" fill="#57534e" />
          <g>
            <rect x="72" y="72" width="62" height="62" rx="14" fill="#fbbf24" stroke="#d97706" strokeWidth="4" />
            <path d="M103 103 m-18 0 a18 18 0 1 1 36 0 a12 12 0 1 1 -24 0" fill="none" stroke="#d97706" strokeWidth="4" />
          </g>
          <g>
            <rect x="150" y="80" width="58" height="58" rx="13" fill="#fcd34d" stroke="#d97706" strokeWidth="4" />
            <path d="M179 109 m-16 0 a16 16 0 1 1 32 0 a11 11 0 1 1 -22 0" fill="none" stroke="#d97706" strokeWidth="4" />
          </g>
          <ellipse cx="236" cy="128" rx="18" ry="10" fill="#f5f5f4" />
          <ellipse cx="236" cy="124" rx="14" ry="7" fill="#fda4af" />
        </g>
      )}
      {dish === "rice" && (
        <g>
          <g stroke="#9aa3ad" strokeWidth="4" fill="none" opacity="0.5" strokeLinecap="round">
            <path d="M128 60 q-10 -20 0 -38" />
            <path d="M172 64 q-10 -20 0 -38" />
          </g>
          <path d="M78 108 a72 40 0 0 0 144 0 z" fill="#efe9df" />
          <ellipse cx="150" cy="108" rx="72" ry="15" fill="#d6cec2" />
          <path d="M92 106 a58 32 0 0 1 116 0" fill="#b45309" />
          <circle cx="150" cy="70" r="10" fill="#7c2d12" />
          <rect x="60" y="140" width="180" height="10" rx="5" fill="#57534e" />
        </g>
      )}
    </svg>
  );
}

/* 吉田: 점주 아바타 (원형, 하치마키) */
export function MarutaOwnerIllust({ className = "" }: IllustProps) {
  return (
    <svg viewBox="0 0 200 200" className={className} {...svgProps}>
      <rect width="200" height="200" fill="#57534e" />
      <path d="M38 200 v-12 q62 -60 124 0 v12 z" fill="#292524" />
      <path d="M92 152 l8 14 l8 -14 z" fill="#f5f5f4" />
      <rect x="89" y="118" width="22" height="26" fill="#e0a37a" />
      <circle cx="100" cy="96" r="40" fill="#eab08c" />
      <path
        d="M58 90 q0 -48 42 -48 q42 0 42 48 q0 -8 -6 -12 q-3 -22 -36 -22 q-33 0 -36 22 q-6 4 -6 12 z"
        fill="#292524"
      />
      <rect x="56" y="62" width="88" height="15" rx="7.5" fill="#f5f5f4" />
      <circle cx="147" cy="69" r="7" fill="#dc2626" />
      <circle cx="86" cy="98" r="3.4" fill="#292524" />
      <circle cx="114" cy="98" r="3.4" fill="#292524" />
      <path d="M80 88 q6 -4 12 -1" stroke="#292524" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M108 87 q6 -3 12 1" stroke="#292524" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M90 114 q10 9 20 0" stroke="#a16543" strokeWidth="3.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/* ------------------------------------------------------------
 * 공용: 지도 일러스트 (3가지 톤)
 * ---------------------------------------------------------- */
const mapTones = {
  sky: { base: "#e2ecf3", block: "#cfdde8", road: "#ffffff", dash: "#cbd5e1", pin: "#0284c7" },
  warm: { base: "#f0e9df", block: "#e2d8c8", road: "#ffffff", dash: "#d6c7b0", pin: "#cf6f6a" },
  dark: { base: "#2f2a26", block: "#3d3730", road: "#57534e", dash: "#78716c", pin: "#f59e0b" },
} as const;

export function MapIllust({
  tone,
  className = "",
}: IllustProps & { tone: keyof typeof mapTones }) {
  const c = mapTones[tone];
  return (
    <svg viewBox="0 0 400 240" className={className} {...svgProps}>
      <rect width="400" height="240" fill={c.base} />
      <g fill={c.block}>
        <rect x="18" y="16" width="130" height="72" rx="8" />
        <rect x="18" y="152" width="130" height="72" rx="8" />
        <rect x="244" y="16" width="138" height="72" rx="8" />
        <rect x="244" y="152" width="138" height="72" rx="8" />
        <rect x="322" y="104" width="60" height="32" rx="6" />
        <rect x="18" y="104" width="60" height="32" rx="6" />
      </g>
      <rect y="96" width="400" height="48" fill={c.road} />
      <rect x="164" width="64" height="240" fill={c.road} />
      <g stroke={c.dash} strokeWidth="3" strokeDasharray="14 12">
        <line x1="0" y1="120" x2="400" y2="120" />
        <line x1="196" y1="0" x2="196" y2="240" />
      </g>
      <path
        d="M196 58 c-19 0 -31 14 -31 30 c0 22 31 48 31 48 c0 0 31 -26 31 -48 c0 -16 -12 -30 -31 -30 z"
        fill={c.pin}
      />
      <circle cx="196" cy="89" r="12" fill="#ffffff" />
    </svg>
  );
}
