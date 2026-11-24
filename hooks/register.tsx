import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'
import { SCENE } from './scene.js'

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
