import { expect, test } from 'claude-code/testing'

// plugin 名稱要跟 plugin.json 一致，場景名稱要跟 register.tsx 的 SCENE_NAME 一致。
const PLUGIN = 'seal-theme'
const SCENE = 'seal-floe'

const backdrop = (surface: 'desktop' | 'mobile' | 'terminal') =>
  ({
    plugin: PLUGIN,
    component: 'Backdrop',
    requestId: 'bg',
    surface,
    viewport: { columns: 100, rows: 30 },
    props: { scene: SCENE, plugin: PLUGIN, glass: false },
  }) as any

const sceneSource = async ($: any, surface: 'desktop' | 'mobile'): Promise<string> => {
  const ui = await $.ui.mount(backdrop(surface))
  const svg = await ui.find({ type: 'Svg' })

  return (svg as any).props.source as string
}

test('session 開始時設定海豹主題與背景場景', async ($, on) => {
  let sent: any
  on('theme.set', ($, e) => {
    sent = e
    return { value: { isDrawn: true } as any }
  })
  on('session.start', () => ({ cwd: '/work' }))
  await $.session.start({ surface: 'desktop', isInteractive: true, cwd: '/work' })
  expect(sent.backdrop.scene).toBe(SCENE)
  // 遮罩刻意不模糊：一模糊就會把游過文字後面的海豹蓋掉。
  expect(sent.backdrop.glass.blur).toBe(0)
})

for (const surface of ['desktop', 'mobile'] as const) {
  test(`${surface} 畫出背景 SVG，大小在上限內`, async $ => {
    const source = await sceneSource($, surface)
    expect(source.startsWith('<svg')).toBe(true)
    expect(source.length < 131072).toBe(true)
  })

  // 桌面版審核會動的背景圖時，只要出現 vw／vh 就整張當成靜止圖，動畫全被拿掉。
  test(`${surface} 場景裡沒有 vw、vh 這類視窗單位`, async $ => {
    const source = await sceneSource($, surface)
    expect(/[\d.](vw|vh|vmin|vmax)\b/.test(source)).toBe(false)
  })

  test(`${surface} 場景有 reduced-motion 規則`, async $ => {
    const source = await sceneSource($, surface)
    expect(source).toContain('@media (prefers-reduced-motion: reduce)')
  })
}

test('終端機不畫背景場景', async $ => {
  const ui = await $.ui.mount(backdrop('terminal'))
  expect(await ui.find({ type: 'Svg' })).toBeUndefined()
})
