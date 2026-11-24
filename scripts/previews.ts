// 產生 README 的預覽圖：從 hooks/scene.ts 的場景做出四張 SVG，寫進 assets/。
// Claude Code 不會載入這個檔案，它只給維護的人用。
//
//   node scripts/previews.ts           改了場景後重新產生
//   node scripts/previews.ts --check   只檢查 assets/ 裡的預覽圖有沒有過期（CI 會跑）
//
// Node 22.18 以上可以直接跑 .ts；更早的 22.x 要加 --experimental-strip-types。

import { readFileSync, writeFileSync } from 'node:fs'

import { SCENE } from '../hooks/scene.ts'

// 場景的根元素是 100%×100%，放進 <img> 會沒有固有尺寸；預覽圖固定成 1600×900 等比例縮放。
const ROOT = '<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">'
const FIXED_ROOT = '<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900">'

const LIGHT = /@media \(prefers-color-scheme: light\) \{\n(.*?)\n\}\n/s
const REDUCED = /@media \(prefers-reduced-motion: reduce\) \{\n(.*?)\n\}\n/s
const SMIL = /<animate(?:Transform)?\b[^>]*\/>/g

// 找不到要改的地方就停下來，免得場景改寫法後默默產生錯的預覽圖。
const once = (svg: string, pattern: RegExp, what: string): RegExpExecArray => {
  const match = pattern.exec(svg)

  if (match === null) {
    throw new Error(`場景裡找不到${what}，scripts/previews.ts 要跟著改`)
  }

  return match
}

type Mode = 'night' | 'day'

const preview = (mode: Mode, still: boolean): string => {
  if (!SCENE.startsWith(ROOT)) {
    throw new Error('場景的根元素變了，scripts/previews.ts 要跟著改')
  }

  let svg = SCENE.slice(ROOT.length)

  // README 表格要並排兩種模式，所以不跟著看的人的系統切換：深色版拿掉淺色規則，淺色版直接套用。
  const light = once(svg, LIGHT, '淺色模式的 @media 區塊')
  svg = svg.replace(light[0], mode === 'day' ? `${light[1]}\n` : '')

  // 靜止版是系統要求減少動態效果時 README 改顯示的那張：跟桌面版一樣把動畫拿掉，
  // CSS 動畫無條件關掉，SMIL 整個移除，每個東西停在場景替它安排的位置。
  if (still) {
    const reduced = once(svg, REDUCED, '減少動態效果的 @media 區塊')
    svg = svg.replace(reduced[0], `${reduced[1]}\n`)
    once(svg, new RegExp(SMIL.source), 'SMIL 動畫')
    svg = svg.replace(SMIL, '')
  }

  const label = `${mode === 'night' ? '深色模式' : '淺色模式'}，${still ? '靜止，減少動態效果時顯示' : '會動'}`
  const note = `<!-- README 預覽圖（${label}）。由 scripts/previews.ts 從 hooks/scene.ts 的場景產生，不要手改。 -->`

  return FIXED_ROOT + note + svg
}

const FILES: [string, string][] = [
  ['preview-night.svg', preview('night', false)],
  ['preview-day.svg', preview('day', false)],
  ['preview-night-still.svg', preview('night', true)],
  ['preview-day-still.svg', preview('day', true)],
]

const isCheck = process.argv.includes('--check')
const stale: string[] = []

for (const [name, svg] of FILES) {
  const path = new URL(`../assets/${name}`, import.meta.url)

  if (isCheck) {
    let current: string | undefined

    try {
      current = readFileSync(path, 'utf8').replace(/\r\n/g, '\n')
    } catch {
      current = undefined
    }

    if (current !== svg) {
      stale.push(name)
    }
  } else {
    writeFileSync(path, svg)
    console.log(`寫入 assets/${name}（${svg.length} 字元）`)
  }
}

if (stale.length > 0) {
  console.error(`這些預覽圖跟場景不一致：${stale.join('、')}`)
  console.error('跑 node scripts/previews.ts 重新產生，再一起 commit。')
  process.exit(1)
}

if (isCheck) {
  console.log('README 預覽圖跟場景一致')
}
