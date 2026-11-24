# seal-theme 開發筆記

Claude Code 的主題 mod。Claude Code 載入 `hooks/hooks.json` 列的 `hooks/register.tsx`，它再 import 背景場景 `hooks/scene.ts` 和配色工具 `hooks/make-colors.js`。

## 改動之後要做的事

- 改了 `hooks/scene.ts`，要跑 `node scripts/previews.ts` 重新產生 `assets/` 的四張 README 預覽圖，跟改動一起 commit。CI 會跑 `node scripts/previews.ts --check`，忘了會失敗。
- 場景裡每個會動的東西，都要在原本的屬性裡有停放位置。使用者要求減少動態效果時，桌面版會把動畫拿掉再畫。
- 場景不能用 vw、vh 這類視窗單位，用了桌面版會把整張當成靜止圖。`tests/look.test.ts` 會檢查。
- hooks 做的事情變了，README.md 的 What this plugin runs 和 README.zh-TW.md 的「外掛會執行什麼」要一起改。
- 送出前跑 `claude plugin validate .` 和 `claude plugin test .`。

## 版本與發布

每次改完都要判斷要不要發版，並主動跟使用者說結論，不要等使用者問。

改動會影響已安裝的人拿到的東西，就要發版。這些是 Claude Code 會載入或顯示的檔案：`hooks/` 底下的檔案、`.claude-plugin/plugin.json`、`.claude-plugin/icon.png`。

- 在同一個 PR 把 `.claude-plugin/plugin.json` 的 `version` 升一號，預設升 patch。版本號沒變，`claude plugin update` 就抓不到新版。
- PR 說明寫明合併後要發 `vX.Y.Z`。

只改 README、`assets/`、`tests/`、`scripts/`、`.github/`、這份 `CLAUDE.md`，不用發版，版本號也不動。

發版在 PR 合併、main 的 CI 通過之後：

1. tag `vX.Y.Z` 打在那個合併 commit 上，GitHub Release 標題也是 `vX.Y.Z`，設為 latest。
2. 說明涵蓋上一個 tag 以來的改動，格式照舊：英文條列（使用者看得到的改動在前，README 和維護在後）、英文的更新指令、`---`、`### 繁體中文` 條列，最後一行是「更新方式：執行上面兩行指令，再重新啟動 Claude Code。」
3. 雲端 session 不能建立 Release，也不能推 tag。這時把說明寫成檔案傳給使用者，並給一段 PowerShell 指令讓使用者自己發：說明放在單引號 here-string（`@'` 到 `'@`）裡，`gh release create` 的 `--target` 寫完整的 commit SHA。
