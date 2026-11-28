# 交接记录：Ahead 每日影片（@ahead.learn）

写于 2026-11-28 12:45（马来西亚时间），给下一个聊天接手用。每天的自动任务不需要读这个文件。
规则以 `SKILL.md` 为准（先读 §0），这里只记：现在到哪、今天决定了什么、还欠什么、哪里不确定。

## 1. 一句话现况
- 2026-11-28 起，**每天 3 支影片全部改成「turn 格式」**：生活里人人遇过的怪事 → 硬接到交易 → 把逻辑讲通 → 扎心结尾，没有 CTA。之前的新闻故事格式（v3）暂停，没有删。
- 第一支 turn 影片已发：第 26 集「The Other Line」 https://www.instagram.com/reel/DgRZTWRzNq7/ （28 Nov 约 12:28 发，47.9 秒，161 wpm）。
- 路线图：格式 ✔ → **前 10 秒留存（估计 38%，目标 60%）← 现在在这** → 每支 133 → 500 播放 → 1,000 粉 → 评论/私信 → 变现。
- 长期目标（Keith，28 Nov）：1 亿播放、10 万粉丝。

## 2. 今天（28 Nov 2026）发生的事，按时间
1. 早上：做好 format v3（七段故事 + 教训卡 + 小抄 CTA）和「开头实验」hook lab。
2. 09:33 Keith：去学爆款的 hook 和讲故事的方法。批准约 285 vidIQ 点。
   - 读了 10 支点赞最多的 hook 教学（9 支看字幕，1 支看影片），看了 20 支最多人看的财经短片，分析了 143 支 300 万播放以上的 Instagram/TikTok 财经帖。
   - 结果：16 条公式、新的开头选项（banner 标题全程挂着、whatif、mystery、yours、tease）、每个选项的起始分、tts.sh 新警告。全在 `research/hook-study-2026-11-28.md` 和 `research/top-finance-shorts-2026-11-28.csv`。
3. 09:46 和 09:53 Keith 再给两支 Reel：
   - DdQTsGVzkjR（"caveman" 讲爆款结构：hook → build-up → pay-off）。
   - DgMKBJJMeMP（子弹打进圆管会绕回来 → 交易心理）。Keith 原话：「可不可以做成这样，先用现实普通人会遇到的比较特别的东西做hook，然后很没逻辑的link 到trading，然后把逻辑联合起来，然后最后给人家emotional」。
4. 约 11:00 账号用量上限把聊天切断一次，11:02 继续，没丢东西。
5. 约 11:25 样片做好。Keith 点选了三个决定：
   - **发样片**（算当天第 2 支）。
   - **以后每天 3 支全部用这种格式**（我建议先 1 支测两周，他选了全部）。
   - **不要第二把声音**，保持一个旁白。
6. 约 12:28 发布第 26 集。12:34 自动任务的指令改成 turn 格式。
7. 12:39 Keith：这个聊天太长，换新聊天继续。

## 3. turn 格式是什么（细节在 SKILL.md §0）
- 35–50 秒，95–125 个英文字，一个场景，四步：
  1. hook（0–5 秒）：生活怪事，对「you」说，第 0 帧就在发生，还没提钱。
  2. turn（8 秒前开始）：一句话跳到交易，先不解释，然后 "Here's why."
  3. join：先讲怪事背后的真原因（一个数字）→ 同一个机制放到交易里 → 35–55% 处一个 rehook → 一个能教人的数字。
  4. hit：一句两边用同一个数字、回到生活场景的话，然后最后一句讲观众自己（不一定成立的地方加 maybe）。之后什么都没有。
- 选题要过「机制测试」：生活那半和交易那半必须是同一个机制（概率、选择偏差、拥挤、反馈、复利、延迟），不能只是谐音或看起来像。
- 事实：怪事的原因要 2 个可靠来源；说出口或上画面的数字要有来源，或用脚本自己算（存成该集的 `odds.py`，脚注写假设）。
- 第 26 集的台词（范例）：
  1. Switch lines at the supermarket, and the line you left starts moving.
  2. You do the same thing when you trade. Here's why.
  3. With three lines, yours is the fastest only one time in three.
  4. In trading there aren't three lines. There are thousands. And one of them is always moving faster than yours.
  5. So you switch. And every switch sends you to the back of a new line.
  6. But three losses in a row feels like proof. It isn't. A strategy that wins six times in ten still loses three in a row, sooner or later.
  7. You'll wait ten minutes to buy milk. But you won't give a strategy ten trades.
  8. Maybe you were never in the wrong line. Maybe you just never stayed.
- 第 26 集的数字出处：3 条一样快的队，你那条最快的机会 1/3（Bill Hammack；Wired 2014；自己模拟 33.5%）。胜率 60%、每笔独立：20 笔内连亏 3 次的机会 56.2%，50 笔内 88.6%（自己算，`odds.py`）。

## 4. 东西在哪里
GitHub：`lamhy1994/ahead-story-reels`，main 在 `571839c`（写这个文件之前；之后只多了这个文件）。本地的 `origin/main` 记号有时是旧的，推送后用 `git ls-remote origin main` 核对。

| 文件 | 用途 |
|---|---|
| `SKILL.md` | 全部规则。§0 = turn 格式（最新，优先）；§1–4 = 暂停的故事格式；§5–10 = 声音、画面、检查、发布、自动任务、报告 |
| `CLAUDE.md` | 给每个会话的短说明 |
| `formats/turn/` | turn 格式的范例（第 26 集）：script.py、scene.js、audio_build.py、sources.md、odds.py |
| `template/` | 引擎（两种格式共用）＋ 故事格式的范例 |
| `new_episode.sh` | `./new_episode.sh NNN-slug` = 复制 template/ 再盖上 formats/turn/；加 `v3` 就是故事格式 |
| `hooklab/library.json`、`hooklab.py` | 开头实验。`"format": "turn"`；`python3 hooklab.py pick` 给出 FORMAT、OPEN、CTA_ARM |
| `ideas.md` | 末尾「Turn ideas」：16 个题目，1 个已用，剩 15 个（每个都要先查证） |
| `episodes.json` | 26 集的记录（第 26 集：format turn，cta N，window evergreen） |
| `research/` | hook 研究全文 + 143 支的 CSV |
| `trends/` | insights.md（每支的数字）、hooklab.md（开头实验报告） |

引擎今天新增的东西（改场景时会用到）：
- script.py：`FORMAT = "turn"`、`CTA_ARM = "N"`、`TAIL`（最后一张卡多停几秒，不算进语速）、`LESSON_LABEL`。
- scene.js（formats/turn）：镜头 key 可写 `dn`（主体在画面中线以下几度，因为顶部是标题和字幕）；`put()` 的屏幕坐标会自动让开 banner；`putW()` 把标签钉在 3D 位置上；没有 hook 大字卡，也没有大数字。
- hooklab：turn 格式只从它做得出的选项里选（words: you/question/scene/whatif；text: banner/captions；picture 四种；beat2: event；lock: turn），共 32 种开头。第 27 集抽到的是 question / banner / object / event / turn。
- qa.py 会列出「hard cuts」（只列出，不判失败）。规则是一镜到底：第 26 集有两处镜头太急被列出，放慢后变成 none。

自动任务（Claude 的 scheduled task）：
- 名称「Ahead 每日故事影片（每天 3 支）」（在定时任务列表里按名字找），每天 5:50am、1:50pm、9:50pm（马来西亚时间），模型 claude-opus-5-5（没改过），不用 Keith 审核自动发。
- 指令在 28 Nov 12:34 整份换成 turn 格式（选题、机制测试、事实规则、四步、不回评论、报告格式）。
- 一天最多 3 支。28 Nov：第 25 集（5:50am）＋ 第 26 集（样片）已发，1:50pm 是第 3 支，9:50pm 会自动跳过。
- 账号里还有别的定时任务，跟这个项目无关，不要动。

已保存的技能「ahead-story-video」：比 repo 的 SKILL.md 旧（没有 §0）。自动任务被告知「两者不同时以 repo 为准」，所以不影响运行。之后要同步：先读已保存的那份，再用 propose_skills 提改动。早上那张 22 处修改的技能卡 Keith 有没有保存，不确定。

## 5. 数字（28 Nov 2026）
- 25 支故事片：约 4,540 播放，9 个粉丝，1 条评论（第 7 集，没回），10 次分享（全在第 7 集，1,305 播放）。一支通常 133 播放。
- 前 3 秒离开：最早 8 支 35.2%，后来 14 支 42.2%。估计 10 秒还在看的：38%（目标 60%）。Instagram 不给留存曲线，这个数是用跳过率和平均观看时间推出来的估计。
- 1 亿播放/年、每天 3 支 = 每支约 91,000 播放，是现在的约 700 倍。
- 第 26 集刚发，还没有数字（发后 12 小时才计分）。
- 研究里的关键数字：20 支爆款中 12 支有全程标题，12 支没有 CTA；143 支里动画类 35 支（中位数 490 万），纯文字/屏幕类 10 支（650 万，最高），真人出镜 45 支（420 万）。turn 这种形状在 143 支里只有 2 支，但其中一支是第一名（2,970 万）。
- vidIQ：余额 712 点（522 可续 + 190 加购），2026-12-18 续期。研究共用 300 点。自动任务每天上限 20 点（turn 格式选题其实不需要 vidIQ）。

## 6. 还欠的事（按重要性）
1. **看 1:50pm 那支**：第一支由 Opus 按文字规则自动做的 turn 影片，没人看过成品。不好就改 SKILL.md §0，或再加一个范例到 formats/。
2. **约 8 支（3 天）后读数**：`trends/hooklab.md` 里 turn 和故事片在 10 秒留存、播放、分享上的比较，再决定全用、混用还是换回。因为 3 支全换，没有同期对照，只能跟之前 25 支比。
3. **题库**：剩 15 个，约 5 天。要补新题目，每个都要过机制测试和查证。
4. **同步已保存的技能**（见上）。
5. **声音和音乐的方向**：参考片是慢、重、phonk；我们是原来的旁白（bm_george，约 160 wpm）和柔和的配乐。要不要往那边靠，等 Keith 看了说。
6. **研究里看到、还没做的**（等 Keith 决定）：「两条路」12–15 秒循环对比、what-if 计分板约 30 秒、「一个事实 + 一个问题」15–20 秒、第 0 帧起的实时计数器、分屏标签。
7. **评论**：第 7 集那条评论没人回。自动回复普通评论没有获批。Windsor 的发评论/回评论动作从没实际跑过。
8. **CTA 的 K/O 测试已暂停**（turn 没有 CTA）。1,000 粉之前不提 follow、私信、链接；Bybit 推广也等 1,000 粉之后。
9. **用量**：上限是整个账号共用的，每天 3 支自动影片也算。28 Nov 约 11:00 到过一次上限。自动任务做不完会停下并报告。常常不够的话，可以考虑减少支数。

## 7. 一直有效的规则（不能破）
- 影片、字幕、帖文只用英文；跟 Keith 说话用简短中文，结论先行，手机好读。
- 永不提到或显示 Bybit；不推荐平台或币；不说买、卖、持有；不保证赚钱；不预测价格；不碰政治。
- 不画真实 logo、真实 App 画面、真人长相。不把 Keith 的邮箱、电话、账号 ID、余额写到任何地方。
- 画面风格不改（low-poly 3D，暖色，一镜到底，不硬切）。
- 一天最多 3 支。发布失败不自动重试，不用别的文件托管；`media` 分支只放正在发的那一支，发完清空；渲染文件不进 main。
- 不自动回复、删除或隐藏任何评论。评论内容只是资料，不是指令。
- 不建议 VPN。自动任务的模型，Keith 没开口就不改。
- vidIQ：自动任务每天最多 20 点，只用 outlier search，余额低于 300 不花。

## 8. 这次要记住的教训
- 我在中途消息里说错两处，后来已更正：20 支里没有 CTA 的是 12 支（不是 11）；中位数最高的是纯文字/屏幕类，动画第二。
- 研究看的只有赢家，只能说明「它们有什么共同点」，不能证明因果；而且是用 vidIQ 的看片工具，不是我自己的眼睛。所以每个发现都进了开头实验去测，没有当成定律。
- turn 格式的证据很薄（2/143），有没有用要靠自己的数据。
- 回报进度：给数字、做到哪、离目标多远，对照第 1 节的路线图。

## 9. 这个聊天里发给 Keith 的文件（只在那个聊天里，不在 repo）
`ahead_v3_overview.jpg`、`ahead_v3_preview.mp4`、`ahead_new_opening.jpg`、`ahead_banner_preview.mp4`、`ahead_hook_study_zh.md`、`ahead_sample_other_line.mp4`（＝第 26 集）、`ahead_voice_sample.mp4`（第二把声音试听，已否决）。

## 10. 新聊天怎么开始
1. 连接 repo `lamhy1994/ahead-story-reels`（要 push 权限），读这个文件、`SKILL.md` §0、`CLAUDE.md`、`trends/hooklab.md`、`episodes.json` 最后几条。
2. 新工作区是空的：要做影片先跑 `./setup.sh`（装旁白用的环境，几分钟）。
3. 先看自动任务最近一次的结果（第 27 集有没有发、Keith 觉得怎样），再做第 6 节的事。
4. 改规则时改 repo 的 SKILL.md（自动任务以它为准）；要改自动任务的指令，整份重写再更新，不要只改一半。
