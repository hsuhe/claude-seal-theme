# 海豹主題 Seal Theme

Claude Code 的主題 mod：冰霧與深海配色。對話背後是一片會動的冰海，五隻海豹在水面下游來游去（其中一隻在追魚群），浮冰上還趴著一隻，另外有冰山、水母、海藻、海星和極光。

## 特色

- 深色模式是夜晚的冰海（極光、星星），淺色模式是白天的冰原。
- 對話區只加一層淡淡的遮罩、不做模糊，海豹游過文字後面也看得到。
- 對話外觀按說話者統一：你的訊息是實心泡泡，Claude 的回覆跟「下一步」框一樣是透明淡框（僅桌面版）。
- 系統開啟「減少動態效果」時，背景動畫會停止。

## 安裝

動態背景在 Claude Code 桌面版與手機版顯示，回覆框樣式只在桌面版。以下兩種方法擇一，macOS、Windows 都適用。

### 方法一：命令列

電腦上已裝好 Claude Code 命令列版（終端機輸入 `claude` 有反應）時，執行：

```bash
claude plugin install seal-theme --marketplace hsuhe/claude-seal-theme
```

### 方法二：請 Claude 幫你裝（只有桌面版也可以）

在 Claude Code 桌面版開新對話，貼上這段：

> 請幫我安裝海豹主題：把 https://github.com/hsuhe/claude-seal-theme 下載到 `~/mods/seal-theme`（有 git 就用 git clone，沒有就下載 zip 解壓縮），然後在 `~/.claude/settings.json` 的 `env` 區塊加入 `"CLAUDE_CODE_PLUGIN_DIRS": "<上面那個資料夾的完整路徑>"`。如果已經有這個鍵，就把新路徑接在原本的值後面（macOS 用冒號 `:` 分隔，Windows 用分號 `;`）。做完告訴我。

這個方法不會自動更新，主題有新版時重新下載一次即可。

裝好後開新對話就會套用主題。

## 已知限制

- 回覆框的框線顏色是固定的，以深色模式為準。

## 授權

MIT，見 [LICENSE](LICENSE)。`hooks/make-colors.js` 與 `hooks/make-colors.d.ts` 是從 Claude Code 的 plugin-authoring skill 原樣複製的工具檔，不在本授權範圍內。
