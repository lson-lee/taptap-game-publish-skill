# TapTap 游戏开发技能库

非官方的 TapTap 开发者开发 skills, 前 Taper,本来是想搞些 h5 小游戏放 tap 上玩一玩,结果这个文档过一眼难尽了,ai 都看不懂（震撼!）

所以搞一些 skills,方便我的小 ideas 快速落地（蹭热点）,也方便大家~ 如果大家有发现规范不对的,请务必一起来迭代! 后面预计还会有分步骤的怎么接入各种 tap DC 的工具的 skills,进度根据我做游戏的进度来...

（如果 Tap 官方要出 skills 那我就真没招了...）

本仓库用于沉淀 TapTap 开发/发布相关的 Skills，面向外部开发者与安装技能的使用者。

- 目标：提供可复用的、基于客观规则的技能，辅助生成或校验 TapTap 平台所需内容
- 安装方式：兼容 `npx skills add <owner>/taptap-game-develop-skills --list`

## 当前可用技能

| Skill | 状态 | 作用 | 入口 |
| --- | --- | --- | --- |
| taptap-game-publish-materials | 可用（持续优化中） | 基于 TapTap 发布页面与官方文档要求，生成/校验上架物料与文案 | `skills/taptap-game-publish-materials/` |

补充说明：
- 覆盖：图标、截图、实机录屏、宣传图/宣传片、首页推荐语、PC/主机封面与编辑推荐素材等

## 安装

列出仓库内可安装技能：

```
npx skills add lson-lee/taptap-game-develop-skills --list
```

安装指定技能：

```
npx skills add lson-lee/taptap-game-develop-skills --skill taptap-game-publish-materials
```

## 路线图（简要）

- 持续新增 TapTap 发布/运营相关 skills

## 贡献

欢迎提交 PR 或 Issue：
- 新增技能：请放在 `skills/<skill-name>/` 并包含 `SKILL.md`
- 更新规则：请保持“客观、可核对、不扩写”原则

## License

MIT
