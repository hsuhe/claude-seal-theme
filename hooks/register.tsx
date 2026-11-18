import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'

const SCENE_NAME = 'seal-floe'

// 白天是冰原與海霧，夜晚是深海；灰階都帶一點海豹的藍灰色。
const { theme, problems } = makeColors({
  label: '海豹',
  roles: { accent: '#2f7fa3', danger: '#c0453b', success: '#3d8a6a', warning: '#b3801f', pro: '#7a6aa8' },
  light: {
    gray: {
      anchors: {
        'surface-0': '#e9eff3',
        'surface-1': '#f1f5f8',
        'surface-2': '#f8fafc',
        'text-primary': '#1c2a33',
        'text-secondary': '#3d4f5b',
        'text-muted': '#55666f',
      },
    },
  },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#0e1820',
        'surface-1': '#141f28',
        // surface-2 也是使用者訊息泡泡的實心底色：比原本的 #19262f 淺一階。
        'surface-2': '#213241',
        'surface-3': '#233544',
        'text-primary': '#f6fafc',
        'text-secondary': '#dbe6eb',
        'text-muted': '#bccad2',
      },
    },
  },
})

// 海面離畫面頂端的距離（像素）。
const SURFACE = 132

// 一條左右都遠超出畫面的波浪線，週期能整除 1600，平移 1600 後首尾相接。
const wave = (y: number, amplitude: number, period: number): string => {
  const half = period / 2
  let d = `M-3200 ${y} q${half / 2} ${-amplitude} ${half} 0`

  for (let x = -3200 + half; x < 4800; x += half) {
    d += ` t${half} 0`
  }

  return d
}

const LINE = 'stroke="#5f7a8c" stroke-linejoin="round"'

// 以畫面寬高的百分比定位、內部單位是像素的內層 svg。
const at = (x: string, y: string, body: string): string =>
  `<svg x="${x}" y="${y}" width="1" height="1" overflow="visible" style="overflow:visible">${body}</svg>`

// 海豹的前鰭長在身體側面、頭後面一點，不是從肚子底下長出來。
// 趴著的海豹：頭朝左，肚子貼在 y=196，寬度約 72 到 384。
const LYING_SEAL = `<g ${LINE} stroke-width="3">
<g class="wag" fill="#7890a0">
<path d="M344 166 C358 146 378 146 384 156 C374 162 364 172 352 182 Z"/>
<path d="M346 176 C364 172 380 180 382 192 C368 192 356 190 348 184 Z"/>
</g>
<path fill="#8ea4b3" d="M92 150 C88 118 118 98 150 102 C200 92 268 116 306 158 C318 170 334 172 348 164 L352 180 C338 192 322 196 300 196 L128 196 C104 196 94 176 92 150 Z"/>
<path fill="#b9c8d2" stroke="none" d="M100 176 C140 192 250 194 300 195 L128 195 C112 195 104 188 100 176 Z"/>
<g fill="#6f8798" opacity=".55" stroke="none">
<circle cx="180" cy="120" r="3"/><circle cx="200" cy="128" r="5"/><circle cx="228" cy="140" r="4"/><circle cx="252" cy="150" r="3.5"/>
</g>
<path fill="#7890a0" d="M171 153 C187 143 210 156 214 180 C199 184 177 174 169 163 Z"/>
<ellipse cx="101" cy="156" rx="15" ry="11" fill="#c6d3db" stroke="none"/>
<ellipse cx="113" cy="153" rx="7" ry="4" fill="#e8a6a0" opacity=".5" stroke="none"/>
<ellipse cx="90" cy="150" rx="5" ry="3.6" fill="#1e2c36" stroke="none"/>
<path d="M92 160 q7 6 14 1" fill="none" stroke="#1e2c36" stroke-width="1.6" stroke-linecap="round"/>
<g fill="none" stroke="#6f8798" stroke-width="1.4" stroke-linecap="round">
<path d="M98 158 L74 154"/><path d="M98 160 L72 162"/><path d="M99 162 L76 170"/>
</g>
<g class="eye" stroke="none">
<circle cx="122" cy="136" r="5.2" fill="#1e2c36"/>
<circle cx="120.4" cy="134.4" r="1.6" fill="#ffffff"/>
</g>
</g>`

// 游泳的海豹：身體打橫像魚雷，頭朝左，原點在身體中心，長約 310。
const SWIM_SEAL = `<g ${LINE} stroke-width="3">
<g class="kick" fill="#7890a0">
<path d="M138 -9 C152 -22 168 -30 186 -30 C184 -24 188 -20 194 -18 C188 -14 190 -8 194 -4 C176 -2 156 2 140 4 Z"/>
<path d="M140 0 C156 0 176 4 194 12 C188 14 188 20 192 24 C184 24 180 28 180 34 C164 26 150 16 138 9 Z"/>
</g>
<path fill="#8ea4b3" d="M-150 2 C-152 -24 -134 -46 -108 -46 C-92 -46 -82 -40 -72 -41 C-30 -64 50 -56 100 -24 C114 -15 127 -11 140 -10 L142 10 C126 13 112 20 96 28 C46 56 -38 60 -88 46 C-112 40 -132 32 -144 18 C-149 13 -150 8 -150 2 Z"/>
<path fill="#b9c8d2" stroke="none" d="M-143 17 C-112 30 -40 42 30 36 C62 32 84 26 99 22 C101 24 99 26 95 27 C46 54 -38 58 -88 44 C-112 38 -131 30 -143 17 Z"/>
<g fill="#6f8798" opacity=".55" stroke="none">
<circle cx="-56" cy="-36" r="3"/><circle cx="-30" cy="-38" r="5"/><circle cx="0" cy="-36" r="3.5"/><circle cx="26" cy="-30" r="4.5"/><circle cx="56" cy="-22" r="3"/><circle cx="-10" cy="-18" r="3"/><circle cx="34" cy="-10" r="2.5"/>
</g>
<path class="paddle" fill="#7890a0" d="M-79 13 C-73 27 -63 41 -47 51 C-43 47 -39 49 -35 53 C-31 47 -27 47 -23 49 C-27 33 -37 21 -53 11 Z"/>
<ellipse cx="-139" cy="4" rx="14" ry="11" fill="#c6d3db" stroke="none"/>
<ellipse cx="-124" cy="2" rx="7" ry="4" fill="#e8a6a0" opacity=".5" stroke="none"/>
<ellipse cx="-151" cy="-2" rx="5" ry="3.6" fill="#1e2c36" stroke="none"/>
<path d="M-149 8 q7 6 14 1" fill="none" stroke="#1e2c36" stroke-width="1.6" stroke-linecap="round"/>
<g fill="none" stroke="#6f8798" stroke-width="1.4" stroke-linecap="round">
<path d="M-142 8 L-120 15"/><path d="M-141 10 L-122 21"/><path d="M-140 12 L-127 27"/>
</g>
<g class="eye" stroke="none">
<circle cx="-115" cy="-15" r="6.4" fill="#1e2c36"/>
<circle cx="-117" cy="-17" r="2" fill="#ffffff"/>
</g>
<g class="puff" fill="none" stroke="#9fd0e6" stroke-width="2">
<circle cx="-96" cy="-62" r="5"/><circle cx="-66" cy="-80" r="3.5"/><circle cx="-40" cy="-92" r="2.5"/>
</g>
</g>`

// 一隻游泳的海豹。深度與橫越位置放在內層 svg 的百分比屬性上，橫越靠 SMIL 改 x：
// 桌面版審核會動的背景圖時不准出現 vw／vh，用了就整張被當成靜止圖、動畫全被拿掉。
// 沒在播時海豹停在 restX。往內依序是上下起伏 → 順著起伏抬頭低頭 → 大小與朝向。
// lane 是 1 到 5；toRight 時整隻左右翻面，抬頭低頭的方向也跟著反過來。
type Swimmer = {
  lane: number
  scale: number
  toRight: boolean
  depth: number
  restX: number
  seconds: number
  lead: number
  extra?: string
}
const swimmer = (o: Swimmer): string =>
  `<svg x="${o.restX}%" y="${o.depth}%" width="1" height="1" overflow="visible" style="overflow:visible">` +
  `<animate attributeName="x" values="${o.toRight ? '-18%;118%' : '118%;-18%'}" dur="${o.seconds}s" begin="${-o.lead}s" repeatCount="indefinite"/>` +
  `<g class="heave h${o.lane}">${o.extra ?? ''}<g class="tilt t${o.lane}${o.toRight ? ' r' : ''}">` +
  `<g transform="scale(${o.toRight ? -o.scale : o.scale} ${o.scale})">${SWIM_SEAL}</g></g></g></svg>`

// 一條小魚，頭朝左。
const fish = (x: number, y: number, scale: number): string =>
  `<g transform="translate(${x} ${y}) scale(${scale})" stroke="none">
<path fill="#7cc4d4" d="M-12 0 C-6 -7 6 -7 12 0 C6 7 -6 7 -12 0 Z M11 0 L21 -7 L21 7 Z"/>
<circle cx="-6" cy="-1.5" r="1.4" fill="#1e2c36"/>
</g>`

// 游在海豹前面的一小群魚（海豹在追牠們）。
const SCHOOL = `<g class="dart" opacity=".8">${[
  [-300, -6, 1], [-338, 12, 0.9], [-330, -30, 0.8], [-372, -10, 1], [-384, 20, 0.75], [-410, -26, 0.85], [-436, 4, 0.9],
]
  .map(([x, y, s]) => fish(x ?? 0, y ?? 0, s ?? 1))
  .join('')}</g>`

// ───────── 環境 ─────────
// 基準色是深色模式，寫在圖形屬性上；淺色模式在 <style> 的 @media 裡覆寫。

// 可重現的雜訊：同樣的 i 和 seed 永遠得到同一個 0 到 1 之間的數。
const noise = (i: number, seed: number): number => {
  const v = Math.sin(i * 127.1 + seed * 311.7) * 43758.5453

  return v - Math.floor(v)
}

// 海底地形的控制點：每 step 像素一個，up 是離畫面底邊的高度。
type Point = { x: number; up: number }
const ridgePoints = (seed: number, base: number, variance: number, step: number): Point[] => {
  const points: Point[] = []

  for (let i = 0, x = -step; x <= 4000 + step; i += 1, x += step) {
    points.push({ x, up: Math.round(base + noise(i, seed) * variance) })
  }

  return points
}

// 把控制點連成平滑的山丘並往下封口。原點在畫面左下角，往上是負的 y。
const ridgePath = (points: Point[]): string => {
  let d = ''
  let last: Point | undefined

  for (const p of points) {
    if (last === undefined) {
      d = `M${p.x} 60 L${p.x} ${-p.up}`
    } else {
      const mid = (last.x + p.x) / 2
      d += ` C${mid} ${-last.up} ${mid} ${-p.up} ${p.x} ${-p.up}`
    }
    last = p
  }

  return last === undefined ? d : `${d} L${last.x} 60 Z`
}

const FAR = ridgePoints(1, 100, 70, 240)
const MID = ridgePoints(2, 58, 50, 190)
const NEAR = ridgePoints(3, 20, 36, 160)

// 把 <defs> 裡的圖形種在某個控制點上，隨水流擺動。
const plant = (id: string, p: Point | undefined, scale: number, delay: number): string =>
  p === undefined
    ? ''
    : `<g transform="translate(${p.x} ${5 - p.up})"><g class="kelp" style="animation-delay:${-delay}s"><use href="#${id}" transform="scale(${scale})"/></g></g>`

// 把 <defs> 裡的圖形擺在某個控制點上，不會動。
const put = (id: string, p: Point | undefined, scale: number, dx = 0): string =>
  p === undefined ? '' : `<use href="#${id}" transform="translate(${p.x + dx} ${6 - p.up}) scale(${scale})"/>`

// 海星的十個頂點（外圈、內圈交替）。
const STAR_POINTS = Array.from({ length: 10 }, (_, i) => {
  const r = i % 2 === 0 ? 15 : 6.5
  const a = (Math.PI / 5) * i - Math.PI / 2

  return `${(r * Math.cos(a)).toFixed(1)},${(r * Math.sin(a)).toFixed(1)}`
}).join(' ')

// 漸層、會飄的微粒圖樣，以及重複使用的圖形。
const DEFS = `<defs>
<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop class="sky0" offset="0" stop-color="#060d17"/><stop class="sky1" offset="1" stop-color="#11293b"/></linearGradient>
<linearGradient id="water" x1="0" y1="0" x2="0" y2="1"><stop class="w0" offset="0" stop-color="#1c5d7c"/><stop class="w1" offset=".22" stop-color="#134560"/><stop class="w2" offset=".6" stop-color="#0c2c40"/><stop class="w3" offset="1" stop-color="#071b29"/></linearGradient>
<linearGradient id="glow" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bfe9f7" stop-opacity=".3"/><stop offset="1" stop-color="#bfe9f7" stop-opacity="0"/></linearGradient>
<linearGradient id="ray" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d9f3fb" stop-opacity=".22"/><stop offset=".85" stop-color="#d9f3fb" stop-opacity="0"/></linearGradient>
<linearGradient id="aurora" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#58d6a3" stop-opacity="0"/><stop offset=".3" stop-color="#58d6a3" stop-opacity=".6"/><stop offset=".62" stop-color="#6fb8e8" stop-opacity=".42"/><stop offset="1" stop-color="#9a7fe0" stop-opacity="0"/></linearGradient>
<linearGradient id="under" x1="0" y1="0" x2="0" y2="1"><stop class="u0" offset="0" stop-color="#9fcbe0" stop-opacity=".8"/><stop class="u1" offset="1" stop-color="#3f7f9f" stop-opacity=".12"/></linearGradient>
<radialGradient id="vignette" cx=".5" cy=".42" r=".8"><stop offset=".55" stop-color="#02080d" stop-opacity="0"/><stop offset="1" stop-color="#02080d" stop-opacity=".5"/></radialGradient>
<radialGradient id="sun"><stop offset="0" stop-color="#ffffff" stop-opacity=".9"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></radialGradient>
<pattern id="driftA" width="260" height="220" patternUnits="userSpaceOnUse">
<animateTransform attributeName="patternTransform" type="translate" from="0 0" to="-260 220" dur="52s" repeatCount="indefinite"/>
<g class="dot" fill="#cfe8f4" opacity=".5"><circle cx="30" cy="40" r="1.4"/><circle cx="120" cy="20" r="1"/><circle cx="200" cy="90" r="1.6"/><circle cx="70" cy="130" r="1.1"/><circle cx="160" cy="170" r="1.3"/><circle cx="240" cy="200" r=".9"/><circle cx="15" cy="190" r="1.2"/></g>
</pattern>
<pattern id="driftB" width="340" height="300" patternUnits="userSpaceOnUse">
<animateTransform attributeName="patternTransform" type="translate" from="0 0" to="340 300" dur="88s" repeatCount="indefinite"/>
<g class="dot" fill="#cfe8f4" opacity=".3"><circle cx="50" cy="60" r=".9"/><circle cx="180" cy="30" r=".7"/><circle cx="290" cy="140" r="1"/><circle cx="110" cy="210" r=".8"/><circle cx="230" cy="260" r=".9"/><circle cx="20" cy="280" r=".7"/></g>
</pattern>
<path id="leaf" d="M0 0 C10 -11 30 -13 46 -3 C31 6 12 8 0 0 Z"/>
<g id="kelp">
<path class="stem" fill="none" stroke="#1d5646" stroke-width="6" stroke-linecap="round" d="M0 8 C-14 -46 14 -92 0 -138 C-12 -176 10 -204 4 -232"/>
<g class="leafs" fill="#2c7560">
<use href="#leaf" transform="translate(-4 -30) rotate(-26)"/><use href="#leaf" transform="translate(-2 -58) scale(-1 1) rotate(-26)"/>
<use href="#leaf" transform="translate(1 -86) rotate(-22)"/><use href="#leaf" transform="translate(3 -114) scale(-1 1) rotate(-22)"/>
<use href="#leaf" transform="translate(-1 -144) rotate(-28)"/><use href="#leaf" transform="translate(-4 -172) scale(-1 1) rotate(-24)"/>
<use href="#leaf" transform="translate(1 -198) scale(.8) rotate(-30)"/><use href="#leaf" transform="translate(3 -218) scale(-.7 .7) rotate(-34)"/>
</g>
</g>
<g id="grass" class="blade" fill="none" stroke="#256b58" stroke-width="4" stroke-linecap="round">
<path d="M0 4 C-6 -18 -16 -32 -22 -50"/><path d="M2 4 C0 -22 -4 -42 -2 -64"/><path d="M4 4 C8 -20 14 -38 22 -54"/><path d="M-3 4 C-10 -12 -22 -20 -34 -28"/><path d="M6 4 C14 -10 26 -18 36 -24"/>
</g>
<g id="rock">
<path class="rock" fill="#1b2e3b" d="M-46 8 C-50 -16 -34 -40 -8 -44 C18 -48 44 -32 50 -8 C52 0 50 6 48 8 Z"/>
<path class="rock-hi" fill="#2d4658" d="M-30 -22 C-22 -34 -6 -40 10 -38 C0 -34 -14 -28 -22 -18 Z"/>
<path class="rock" fill="#1b2e3b" d="M44 8 C44 -4 54 -12 66 -10 C76 -8 80 0 78 8 Z"/>
</g>
<g id="star"><polygon points="${STAR_POINTS}" fill="#c9785f" stroke="#a85f4a" stroke-width="3" stroke-linejoin="round"/><circle r="2" fill="#e3a48f"/></g>
<g id="chunk">
<path class="ice-face" fill="#8fbdd3" opacity=".5" d="M-15 0 L16 0 L12 10 L2 15 L-10 9 Z"/>
<path class="ice-top" fill="#eaf5fa" stroke="#7fa3b6" stroke-width="1" stroke-linejoin="round" d="M-15 0 L-7 -7 L9 -8 L16 0 Z"/>
</g>
<g id="jelly">
<g fill="none" stroke="#d6c7f2" stroke-width="1.6" stroke-linecap="round" opacity=".55">
<path d="M-16 6 C-21 22 -12 36 -18 56"/><path d="M-6 8 C-9 26 -2 44 -7 66"/><path d="M5 8 C9 26 2 42 7 62"/><path d="M15 6 C20 20 12 36 17 52"/>
</g>
<path fill="#c7b3ee" fill-opacity=".42" stroke="#e6dcfb" stroke-opacity=".7" stroke-width="1.5" d="M-27 2 C-27 -34 27 -34 27 2 C19 8 10 3 0 8 C-10 3 -19 8 -27 2 Z"/>
<path fill="#ffffff" opacity=".22" d="M-17 -8 C-13 -20 -2 -25 8 -24 C-1 -20 -9 -14 -12 -4 Z"/>
</g>
</defs>`

// 冰山：水面上一小角，水面下一大塊半透明的冰。原點在水面。flat 的那種頂上是平的，趴著一隻海豹。
const iceberg = (scale: number, flat: boolean): string =>
  `<g transform="scale(${scale})"><g class="bob">
<path fill="url(#under)" d="M-70 0 L72 0 L80 28 L52 74 L12 104 L-30 84 L-62 46 Z"/>
<path fill="#ffffff" opacity=".1" d="M-8 30 L52 74 L12 104 L-30 84 Z"/>
<path fill="none" stroke="#d6ecf5" stroke-width="1.5" stroke-linejoin="round" opacity=".35" d="M-30 84 L-8 30 L52 74 M-8 30 L20 0 M-62 46 L-8 30"/>
<g stroke="#7fa3b6" stroke-width="1.2" stroke-linejoin="round">${
    flat
      ? `<path class="ice-face" fill="#b9d3e0" d="M-74 0 L-66 -10 L68 -12 L76 0 Z"/><path class="ice-top" fill="#eaf5fa" d="M-66 -10 L-58 -16 L60 -18 L68 -12 Z"/>`
      : `<path class="ice-top" fill="#eaf5fa" d="M-66 0 L-38 -24 L-8 -34 L-2 0 Z"/><path class="ice-face" fill="#b9d3e0" d="M-8 -34 L30 -20 L64 0 L-2 0 Z"/><path fill="#ffffff" stroke="none" opacity=".75" d="M-38 -24 L-8 -34 L-12 -26 L-30 -18 Z"/>`
  }</g>
<path fill="none" stroke="#f2fbff" stroke-width="2" stroke-linecap="round" opacity=".75" d="M-72 0 L74 0"/>
${flat ? `<g transform="translate(-73 -78) scale(.32)">${LYING_SEAL}</g>` : ''}
</g></g>`

// 漂在水面上的東西：位置是內層 svg 的 x 百分比，靠 SMIL 慢慢改。沒在播時停在 rest。
// smooth 是來回漂（兩端減速），否則是等速橫越整個畫面。
const adrift = (rest: number, values: string, seconds: number, lead: number, smooth: boolean, body: string): string =>
  `<svg x="${rest}%" y="${SURFACE}" width="1" height="1" overflow="visible" style="overflow:visible">` +
  `<animate attributeName="x" values="${values}" dur="${seconds}s" begin="${-lead}s" repeatCount="indefinite"${
    smooth ? ' calcMode="spline" keyTimes="0;.5;1" keySplines=".45 0 .55 1;.45 0 .55 1"' : ''
  }/>${body}</svg>`

// 水面上的小碎冰，等速從一邊漂到另一邊。
const chunk = (rest: number, scale: number, toRight: boolean, seconds: number, lead: number): string =>
  adrift(
    rest,
    toRight ? '-4%;104%' : '104%;-4%',
    seconds,
    lead,
    false,
    `<g class="bob late"><use href="#chunk" transform="scale(${scale})"/></g>`,
  )

// 夜空的星星（只在深色模式出現）。
const STARS = [4, 11, 19, 27, 36, 44, 52, 63, 71, 79, 87, 95]
  .map(
    (x, i) =>
      `<circle class="star night" style="animation-delay:${-(i % 4)}s" cx="${x}%" cy="${Math.round(6 + noise(i, 7) * (SURFACE - 34))}" r="${(0.8 + noise(i, 9) * 0.9).toFixed(1)}" fill="#e8f4fb"/>`,
  )
  .join('')

// 從水面斜射下來的光柱：畫在一個會被拉滿畫面的 100×100 座標裡，由上往下漸淡。
const RAYS = [
  [6, 5], [19, 3], [31, 7], [46, 4], [58, 6], [72, 3], [86, 5],
]
  .map(
    ([x = 0, w = 4], i) =>
      `<path class="ray" style="animation-delay:${-i * 1.7}s" fill="url(#ray)" d="M${x} 0 L${x + w} 0 L${x + w + 24} 100 L${x + 18} 100 Z"/>`,
  )
  .join('')

// 往上冒的氣泡：位置用百分比，上升靠 SMIL 改 cy，每顆的速度和起跑時間都錯開。
// 沒在播時散落在各自的高度，不會排成一列。
const BUBBLES = [6, 15, 24, 33, 47, 58, 69, 80, 88, 95]
  .map((x, i) => {
    const timing = `dur="${16 + ((i * 7) % 11)}s" begin="${-((i * 5) % 17)}s" repeatCount="indefinite"`

    return (
      `<circle class="sway bub" style="animation-delay:${-(i % 5)}s" cx="${x}%" cy="${22 + ((i * 37) % 70)}%" r="${3 + (i % 4)}" fill="#bfe6f5" fill-opacity=".14" stroke="#bfe6f5" stroke-width="1.4" opacity=".6">` +
      `<animate attributeName="cy" values="103%;10%" ${timing}/>` +
      `<animate attributeName="opacity" values=".6;.6;0" keyTimes="0;.85;1" ${timing}/></circle>`
    )
  })
  .join('')

// 一隻緩慢漂浮的水母：位置用百分比，上下與左右各自慢慢來回。
const jelly = (x: [number, number], y: [number, number], seconds: number, scale: number, opacity: number): string =>
  `<svg x="${x[0]}%" y="${y[0]}%" width="1" height="1" overflow="visible" style="overflow:visible" opacity="${opacity}">` +
  `<animate attributeName="y" values="${y[0]}%;${y[1]}%;${y[0]}%" dur="${seconds}s" repeatCount="indefinite"/>` +
  `<animate attributeName="x" values="${x[0]}%;${x[1]}%;${x[0]}%" dur="${seconds * 1.6}s" repeatCount="indefinite"/>` +
  `<g class="pulse"><use href="#jelly" transform="scale(${scale})"/></g></svg>`

// 遠處游過的一小群魚，又小又淡。
const FAR_SCHOOL =
  `<svg x="70%" y="28%" width="1" height="1" overflow="visible" style="overflow:visible" opacity=".32">` +
  `<animate attributeName="x" values="118%;-18%" dur="110s" begin="-42s" repeatCount="indefinite"/>` +
  `<g class="dart" transform="scale(.55)">${[
    [0, 0, 1], [-34, 16, 0.9], [-28, -22, 0.8], [-70, -6, 1], [-84, 24, 0.8], [-110, -20, 0.9],
  ]
    .map(([x, y, s]) => fish(x ?? 0, y ?? 0, s ?? 1))
    .join('')}</g></svg>`

// 動畫與淺色模式的顏色。圖形的位置都寫在屬性上；這裡不能出現 vw／vh（見 swimmer 的說明）。
const STYLE = `<style>
:root { color-scheme: light dark; }
.day { display: none; }
.heave { animation: heave 6s ease-in-out infinite alternate; }
.tilt { animation: tilt 6s ease-in-out infinite alternate; transform-box: fill-box; transform-origin: center; }
.tilt.r { animation-direction: alternate-reverse; }
.h1 { animation-delay: 0s; } .t1 { animation-delay: -3s; }
.h2 { animation-delay: -2s; } .t2 { animation-delay: -5s; }
.h3 { animation-delay: -4s; } .t3 { animation-delay: -7s; }
.h4 { animation-delay: -1s; } .t4 { animation-delay: -4s; }
.h5 { animation-delay: -5s; } .t5 { animation-delay: -8s; }
.kick { animation: kick .9s ease-in-out infinite alternate; transform-box: fill-box; transform-origin: 0% 50%; }
.paddle { animation: paddle 1.8s ease-in-out infinite alternate; transform-box: fill-box; transform-origin: 0% 0%; }
.wag { animation: kick 3.2s ease-in-out infinite alternate; transform-box: fill-box; transform-origin: 0% 60%; }
.eye { animation: blink 5.5s infinite; transform-box: fill-box; transform-origin: center; }
.puff { animation: puff 2.4s ease-out infinite; }
.dart { animation: heave 3.4s ease-in-out infinite alternate; }
.bob { animation: bob 7s ease-in-out infinite alternate; transform-box: fill-box; transform-origin: center; }
.late { animation-delay: -3s; }
.w1 { animation: drift 38s linear infinite; }
.w2 { animation: drift 54s linear infinite reverse; }
.glint { animation: glint 9s linear infinite; }
.ray { animation: glow 9s ease-in-out infinite alternate; }
.kelp { animation: lean 5s ease-in-out infinite alternate; transform-box: fill-box; transform-origin: 50% 100%; }
.sway { animation: sway 5s ease-in-out infinite alternate; }
.star { animation: twinkle 3.5s ease-in-out infinite alternate; }
.aur { animation: shimmer 11s ease-in-out infinite alternate; }
.aur.b { animation-delay: -5s; }
.pulse { animation: pulse 2.6s ease-in-out infinite alternate; transform-box: fill-box; transform-origin: 50% 30%; }
@keyframes heave { from { transform: translateY(-22px); } to { transform: translateY(22px); } }
@keyframes sway { from { transform: translateX(-9px); } to { transform: translateX(9px); } }
@keyframes tilt { from { transform: rotate(6deg); } to { transform: rotate(-6deg); } }
@keyframes kick { from { transform: rotate(-9deg); } to { transform: rotate(11deg); } }
@keyframes paddle { from { transform: rotate(-6deg); } to { transform: rotate(14deg); } }
@keyframes blink { 0%, 93%, 100% { transform: scaleY(1); } 96% { transform: scaleY(.1); } }
@keyframes puff { from { opacity: .8; transform: translate(0, 0); } to { opacity: 0; transform: translate(18px, -22px); } }
@keyframes bob { from { transform: translateY(-2px) rotate(-.8deg); } to { transform: translateY(3px) rotate(.8deg); } }
@keyframes drift { to { transform: translateX(-1600px); } }
@keyframes glint { to { stroke-dashoffset: -340; } }
@keyframes glow { from { opacity: .3; } to { opacity: 1; } }
@keyframes lean { from { transform: skewX(-7deg); } to { transform: skewX(7deg); } }
@keyframes twinkle { from { opacity: .25; } to { opacity: 1; } }
@keyframes shimmer { from { opacity: .3; } to { opacity: .8; } }
@keyframes pulse { from { transform: scale(1.06, .9); } to { transform: scale(.94, 1.06); } }
@media (prefers-color-scheme: light) {
  .night, .vig { display: none; }
  .day { display: inline; }
  .sky0 { stop-color: #eef6fa; } .sky1 { stop-color: #cfe6f1; }
  .w0 { stop-color: #d9eef6; } .w1 { stop-color: #c0e0ee; } .w2 { stop-color: #a6cfe3; } .w3 { stop-color: #8bbdd6; }
  .far { fill: #9dc6da; } .mid { fill: #84b4cc; } .near { fill: #6b9fba; stroke: #8fbdd3; }
  .stem { stroke: #2f7d66; } .leafs { fill: #4a9a80; } .blade { stroke: #3c8a72; }
  .rock { fill: #5d7f93; } .rock-hi { fill: #86a8ba; }
  .ice-top { fill: #ffffff; } .ice-face { fill: #dbeaf2; }
  .u0 { stop-color: #d3e9f2; } .u1 { stop-color: #7fb0c8; }
  .dot { fill: #ffffff; }
  .bub { stroke: #5fa3c2; fill: #ffffff; }
  .rayset { opacity: .7; }
  .surf { stroke: #3f8fb5; }
}
@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; }
}
</style>`

const SURF = 'fill="none" stroke-linecap="round"'

const SCENE = `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">${STYLE}${DEFS}
<rect width="100%" height="${SURFACE + 2}" fill="url(#sky)"/>
<svg class="night" width="100%" height="${SURFACE}" viewBox="0 0 100 10" preserveAspectRatio="none">
<path class="aur" fill="url(#aurora)" d="M0 6 C15 1 30 9 50 4 C70 0 85 7 100 3 L100 6 C85 10 70 3 50 7 C30 12 15 4 0 9 Z"/>
<path class="aur b" fill="url(#aurora)" opacity=".6" d="M0 3 C20 6 35 0 55 2 C75 4 88 1 100 5 L100 7 C88 3 75 6 55 4 C35 2 20 8 0 5 Z"/>
</svg>
${STARS}
<circle class="day" cx="80%" cy="20" r="170" fill="url(#sun)"/>
<rect y="${SURFACE}" width="100%" height="100%" fill="url(#water)"/>
<rect y="${SURFACE}" width="100%" height="190" fill="url(#glow)"/>
<svg class="rayset" y="${SURFACE}" width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">${RAYS}</svg>
<rect y="${SURFACE + 6}" width="100%" height="100%" fill="url(#driftB)"/>
${at('0', '100%', `<path class="far" fill="#143b51" opacity=".6" d="${ridgePath(FAR)}"/>`)}
${FAR_SCHOOL}
${jelly([76, 71], [38, 30], 38, 0.6, 0.75)}
${at(
  '0',
  '100%',
  `<g opacity=".8">${plant('kelp', MID[1], 0.9, 1)}${plant('kelp', MID[5], 1.05, 3)}${plant('kelp', MID[9], 0.85, 2)}${plant('kelp', MID[13], 1, 4)}</g>` +
    `<path class="mid" fill="#0f2e41" d="${ridgePath(MID)}"/>`,
)}
<rect y="${SURFACE + 6}" width="100%" height="100%" fill="url(#driftA)"/>
${swimmer({ lane: 3, scale: 0.3, toRight: true, depth: 82, restX: 48, seconds: 38, lead: 24 })}
${swimmer({ lane: 4, scale: 0.36, toRight: false, depth: 46, restX: 84, seconds: 44, lead: 8 })}
${jelly([20, 26], [64, 52], 46, 0.95, 0.9)}
${swimmer({ lane: 2, scale: 0.44, toRight: false, depth: 58, restX: 66, seconds: 64, lead: 20, extra: SCHOOL })}
${swimmer({ lane: 5, scale: 0.5, toRight: true, depth: 70, restX: 14, seconds: 58, lead: 12 })}
${swimmer({ lane: 1, scale: 0.6, toRight: true, depth: 37, restX: 30, seconds: 50, lead: 15 })}
${BUBBLES}
${at(
  '0',
  '100%',
  plant('kelp', NEAR[2], 0.7, 0) +
    plant('kelp', NEAR[6], 0.82, 2) +
    plant('kelp', NEAR[10], 0.74, 1) +
    plant('kelp', NEAR[14], 0.8, 3) +
    `<path class="near" fill="#0a2231" stroke="#1f4a61" stroke-width="1.5" d="${ridgePath(NEAR)}"/>` +
    put('rock', NEAR[3], 0.9) +
    put('rock', NEAR[8], 1.1) +
    put('rock', NEAR[13], 0.8) +
    put('star', NEAR[7], 1, 30) +
    put('star', NEAR[15], 0.8, -20) +
    plant('grass', NEAR[1], 1, 0) +
    plant('grass', NEAR[4], 0.9, 2) +
    plant('grass', NEAR[8], 1.1, 1) +
    plant('grass', NEAR[11], 0.9, 3) +
    plant('grass', NEAR[16], 1, 2),
)}
${chunk(5, 0.8, true, 180, 15)}${chunk(27, 1, false, 210, 150)}${chunk(53, 1.2, true, 160, 85)}
${chunk(63, 0.7, false, 240, 90)}${chunk(74, 1.1, true, 200, 145)}${chunk(96, 0.9, false, 170, 12)}
${adrift(13, '10%;17%;10%', 170, 60, true, iceberg(0.8, false))}
${adrift(88, '91%;84%;91%', 200, 20, true, iceberg(1.15, false))}
${adrift(40, '30%;50%;30%', 120, 30, true, iceberg(1, true))}
${at(
  '50%',
  '0',
  `<path class="w2 surf" ${SURF} stroke="#5aa9c9" stroke-width="2" opacity=".45" d="${wave(SURFACE + 10, 7, 320)}"/>` +
    `<g class="w1"><path ${SURF} stroke="#bfe9f7" stroke-width="12" opacity=".22" d="${wave(SURFACE + 4, 8, 200)}"/>` +
    `<path class="surf" ${SURF} stroke="#7fc6e3" stroke-width="2.5" opacity=".9" d="${wave(SURFACE, 8, 200)}"/>` +
    `<path class="glint" ${SURF} stroke="#ffffff" stroke-width="2.5" stroke-dasharray="22 318" opacity=".85" d="${wave(SURFACE, 8, 200)}"/></g>`,
)}
<rect class="vig" width="100%" height="100%" fill="url(#vignette)"/>
</svg>`

const LOOK: ThemeSetArgs = {
  colors: theme,
  // 對話欄上的遮罩刻意維持淡而不模糊：加濃或加模糊都會把游過文字後面的海豹蓋掉。
  // 文字清楚度改由上面深色模式的文字顏色負責。
  backdrop: { scene: SCENE_NAME, glass: { blur: 0, opacity: 0.45 } },
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    // 開發期間：若有一行會讓 Desktop 整個不畫這個主題，就跳出提示。
    const unpainted = problems.find(line => line.startsWith("Desktop won't paint"))

    if (unpainted !== undefined) {
      $.ui.toast(unpainted)
    }
    // 這時 App 常常還沒接上，theme.set 會回 isDrawn: false；但主題整個 session 有效，
    // App 接上後照樣會畫，所以不把 reason 放到狀態列（放了也沒人清，終端機還會一直掛著）。
    await $.theme.set(LOOK)

    return next(e)
  })

  on('ui.render', { component: 'Backdrop' }, ($, e, next) => {
    if (e.props.scene !== SCENE_NAME) {
      return next(e)
    }

    if (e.surface !== 'desktop' && e.surface !== 'mobile') {
      return next(e)
    }

    const { Svg } = $.ui.resolve(e)

    return (
      <Svg
        source={SCENE}
        alt="極光下的冰海：五隻海豹在水面下游來游去，其中一隻追著一群小魚；海面漂著冰山，海底有海藻、岩石和海星"
        isInteractive
      />
    )
  })

  // 按說話者統一：使用者訊息是實心泡泡；Claude 的回覆跟「下一步」框一樣，無底色、只有淡白框線，海豹游過看得到。
  // 邊框顏色取自截圖實測（App 那條淡白線疊在背景上約是 #324b5b）；邊框必須用實色，帶透明度的色碼畫不出來。
  // 只在桌面版做；邊框顏色是固定的（沒辦法跟著深淺模式換），以深色模式為準。
  on('ui.render', { component: 'AssistantMessage' }, async ($, e, next) => {
    if (e.surface !== 'desktop') {
      return next(e)
    }

    const { Box } = $.ui.resolve(e)

    return (
      <Box borderStyle="round" borderColor="#324b5b" paddingX="md" paddingY="sm">
        {await next(e)}
      </Box>
    )
  })
}
