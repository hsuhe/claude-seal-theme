# 海豹主題 Seal Theme

[English](README.md) | 繁體中文

Claude Code 的主題 mod：冰霧與深海配色。對話背後是一片會動的冰海，五隻海豹在水面下游來游去（其中一隻在追魚群），浮冰上還趴著一隻，另外有冰山、水母、海藻、海星和極光。

| 深色模式（夜晚） | 淺色模式（白天） |
| --- | --- |
| ![深色模式的冰海背景](assets/preview-night.png) | ![淺色模式的冰海背景](assets/preview-day.png) |

預覽圖只有背景本身；實際使用時對話會疊在上面，海豹、魚群和海浪都會動。

## 特色

- 深色模式是夜晚的冰海（極光、星星），淺色模式是白天的冰原。
- 對話區只加一層淡淡的遮罩、不做模糊，海豹游過文字後面也看得到。
- 對話外觀按說話者統一：你的訊息是實心泡泡，Claude 的回覆跟「下一步」框一樣是透明淡框（僅桌面版）。
- 系統開啟「減少動態效果」時，背景動畫會停止。

## 安裝

需要 Claude Code 命令列版 2.1.323 以上（可用 `claude --version` 查看）。在終端機執行：

```bash
claude plugin marketplace add hsuhe/claude-seal-theme
claude plugin install seal-theme@claude-seal-theme
```

預設裝在 user 範圍，你電腦上的每個 session 都會載入。主題只在 Claude 桌面版 Code 分頁的本機 session 顯示，在那裡開新對話就會看到。

## 更新

自己加入的 marketplace 預設不會自動更新。要取得新版，執行：

```bash
claude plugin marketplace update claude-seal-theme
claude plugin update seal-theme@claude-seal-theme
```

重新啟動 Claude Code 後生效。

## 移除

```bash
claude plugin uninstall seal-theme@claude-seal-theme
claude plugin marketplace remove claude-seal-theme
```

## 外掛會執行什麼

這個外掛是 mod：`hooks/register.tsx` 是 hooks module，Claude Code 會載入它並以你的權限執行（所有 mod 都是這樣）。它做的事只有以下這些：

- session 開始時，套用海豹配色和動態背景（`$.theme.set`）。如果配色檢查發現會讓桌面版畫不出主題的問題，會用 toast 顯示那一行（`$.ui.toast`）。
- 桌面版或手機版要畫背景時，提供冰海場景，也就是直接寫在 `register.tsx` 裡的 SVG。
- 在桌面版把 Claude 的每則回覆包上一圈淡框。

兩個繪製用的 hook 只用 `$.ui.resolve` 取得 App 本身的 `Svg` 與 `Box` 元件。`hooks/make-colors.js` 負責把幾個基本色展開成完整的淺色與深色配色，只在模組載入時跑一次。

這個外掛不連網、不讀寫檔案、不啟動任何程式，也不收集、儲存或傳送任何資料。它不載入外部圖片或字型，整個背景都來自 `register.tsx` 裡的 SVG。

## 已知限制

- 終端機、雲端 session 和手機 App（包括 Remote Control）都看不到這個主題。
- 回覆框的框線顏色是固定的，以深色模式為準。

## 授權

MIT，見 [LICENSE](LICENSE)。`hooks/make-colors.js` 與 `hooks/make-colors.d.ts` 是從 Claude Code 的 plugin-authoring skill 原樣複製的工具檔，不在本授權範圍內。
