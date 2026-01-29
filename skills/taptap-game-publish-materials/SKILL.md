---
name: taptap-game-publish-materials
description: TapTap 平台发布物料生成与校验。用于根据最终规则生成/整理上架物料、规范化现有素材、输出结构化目录并逐项校验合规性。
---

# TapTap 发布物料技能

## 快速开始

用户可以说：
- "帮我准备 TapTap 发布物料"
- "检查我的 TapTap 上架素材是否符合规范"
- "生成 TapTap 游戏发布物料清单"

## 工作流程

### 第一步：选择工作方式（必须先询问）

向用户展示三种方式：

**🤖 自动读取模式**（推荐：已有项目代码）
- 自动扫描代码和素材文件，智能提取信息并生成物料
- 所有步骤自动完成（除非有冲突或需要用户决策）
- 预计 5-10 分钟

**💬 问询式模式**（推荐：首次使用/素材分散）
- 逐项询问游戏信息和素材
- 逐步确认每个环节
- 预计 15-30 分钟

**📋 用户自理模式**（仅获取规范）
- 输出完整的素材清单和规范文档
- 立即输出

---

### 第二步：执行生成

#### 自动读取模式的流程

1. 扫描项目目录，识别：
   - 游戏配置文件（提取名称、简介等）
   - 已有图片素材（图标、截图等）
   - 已有视频素材（录屏、宣传片等）
   
2. 自动提取信息并分类整理

3. 识别缺失素材：
   - 若素材完整 → 直接格式化并输出
   - 若素材缺失 → 询问用户如何处理（见"素材生成策略"）

4. 自动生成结构化输出目录

5. 自动执行校验并输出报告

**重要：** 自动模式下，只在以下情况询问用户：
- 关键信息冲突或无法确定
- 缺少必填素材（需要用户决定如何获取）
- 校验发现严重问题

#### 问询式模式的流程

按阶段逐项询问：

**阶段 1/4：基础信息**
- 游戏名称、类型、简介
- 是否开放下载/试玩、是否 PC/主机、是否申请编辑推荐

**阶段 2/4：核心素材**
- 游戏图标、游戏截图、实机录屏

**阶段 3/4：宣传素材**
- 宣传图 16:9、宣传图 1:1、宣传片、首页推荐语

**阶段 4/4：特殊素材**
- PC/主机封面、编辑推荐位素材、测试服信息

**提问规范：**
- 每完成一个阶段显示进度：`✅ 已完成阶段 1/4`
- 提问时从 `rules.md` 引用具体规则，例如：
```
请提供游戏图标：

📋 规则要求（来自 rules.md）：
- 尺寸：不低于 512 x 512px
- 格式：JPG / PNG
- 形状：必须为直角方形，不可自行切圆角
- 底色：不得使用白底/黑底/透明底
- 安全区域：显示时会按约 22% 弧度裁切圆角，重要内容需避开裁切区域
```

#### 用户自理模式的流程

直接输出：
1. 完整的素材清单（含尺寸、格式、数量要求）
2. 规则文档摘要
3. 建议的目录结构

---

### 素材获取策略

#### 优先级
1. **优先复用已有素材**：自动格式化（裁切/转换/压缩/重命名）
2. **需要新素材时**：询问用户选择生成方式

#### 素材生成方式（需要新素材时询问）

##### 步骤 1：自动检测内置生图能力

检测当前环境是否有生图工具（如 Gemini 的 `GenerateImage`、Antigravity 等）。

##### 步骤 2：展示选项（根据检测结果动态调整）

**选项 A：使用内置 AI 生成** ⭐（仅当检测到时显示）
- 直接调用内置生图工具，无需配置
- 根据素材规格和 TapTap 规则构建提示词
- 生成后自动保存到输出目录

**选项 B：使用外部 AI 生图服务**
- 调用第三方生图 API（如 Gemini Imagen API）
- 需要配置 API Key（首次使用 3-5 分钟）
- 详见"外部生图服务配置"

**选项 C：我自己准备素材**
- 系统给出要求，用户提供后自动校验

**选项 D：跳过此素材**
- 继续处理其他素材

#### 生图 Prompt 构建规范（重要）

生成图片时，必须严格遵循以下规范，并且**确保所有图片要求都在 prompt 里被明确表达**（尺寸/比例/文字限制/安全区/禁止项等）。

**安全区域处理（关键）：**
- 安全区域（如宣传图上下 108px、图标 22% 圆角区）**仍需绘制完整内容**
- 安全区内避免放置关键视觉主体（LOGO、主角面部等）
- **禁止使用**：模糊效果、截断、黑白边框、渐变遮罩、留白等方式糊弄
- **正确做法**：在安全区绘制背景延伸、装饰元素、环境细节等次要内容，保持画面完整性

---

#### 提示词交付方式（按用户选择的工具“给最合适的格式”）

你必须先问用户选哪种方式，然后按下面规则输出：

##### A. 用户选择 **Nano Banana / Nano Banana Pro（Gemini）**

**要求：把提示词改成 JSON 规格**（更利于复杂约束被拆解与对齐），并让 AI 现场用最合适的 JSON 字段去调用脚本 `tools/nano-bananapro-generate-image.mjs`。

- 交付物必须包含：
  - `image-spec.json`（JSON 规格）
  - 一条可复制的命令（`node ... --input ... --out ...`）
  - 输出路径必须落到结构化目录对应文件夹

**JSON 以“下面的示例结构”为准**（不强制固定字段名；只要能被 JSON 结构清晰表达即可）。

但必须确保这些**硬性要求**在 JSON 的 `prompt` 内明确出现（可以拆到多个字段里）：
- **尺寸/比例**：例如 16:9 / 1:1（并在 `aspectRatio` 里同步填写）
- **清晰度/质量**：高清、细节清晰、无压缩糊、无噪点糊；非截图、非简单拼贴
- **文字规则**：必须/禁止出现哪些文字（例如“仅允许游戏标题” + 标题面积占比限制）
- **安全区域**：哪些区域不能放关键主体/文字，但仍要完整绘制背景延伸
- **禁止项**：水印、边框、截断、模糊遮罩、留白、额外文字等

**示例（宣传图 16:9，JSON prompt 参考结构）**：

说明：
- 下面的 `prompt` 结构参考了社区整理的 Nano Banana 结构化 JSON Schema（更适合把“主体/场景/文字/禁止项/安全区”拆开描述），可参考：[Nano Banana structured JSON prompt schema（社区）](https://gist.github.com/alexewerlof/1d13401a7647339469141dc2960e66a9)。

`image-spec.json`
```json
{
  "prompt": {
    "user_intent": "为 TapTap 生成宣传图（16:9），赛博朋克霓虹城市，含且仅含游戏标题。",
    "meta": {
      "target_platform": "TapTap",
      "asset_type": "宣传图_16x9",
      "style_keywords": ["cyberpunk", "neon city", "high detail", "cinematic lighting"]
    },
    "scene": {
      "location": "霓虹城市街道",
      "time": "night",
      "lighting": "neon lights, cinematic, high contrast, clean highlights",
      "background_elements": ["city skyline", "neon signs (no readable text)", "wet reflective ground"]
    },
    "subject": [
      {
        "id": "hero",
        "type": "person",
        "description": "主角站在画面中心，姿态坚定，细节清晰，非卡通",
        "position": "center",
        "pose": "standing",
        "expression": "stoic"
      }
    ],
    "text_rendering": {
      "enabled": true,
      "text_content": "XXX",
      "placement": "center_upper",
      "font_style": "bold sans-serif, clean, high legibility",
      "constraints": {
        "only_allowed_text": true,
        "max_area_ratio": 0.25
      }
    },
    "layout_constraints": {
      "safe_zones": [
        {
          "name": "top_safe_zone",
          "area": "top_108px",
          "rule": "必须完整绘制背景延伸/装饰细节；禁止放置关键角色主体或任何文字"
        },
        {
          "name": "bottom_safe_zone",
          "area": "bottom_108px",
          "rule": "必须完整绘制背景延伸/装饰细节；禁止放置关键角色主体或任何文字"
        }
      ],
      "no_cropping": true,
      "no_borders": true,
      "no_blur_masks": true,
      "no_blank_margins": true
    },
    "quality_requirements": {
      "high_definition": true,
      "not_a_screenshot": true,
      "not_a_simple_collage": true
    },
    "negative_prompt": [
      "watermark",
      "extra text",
      "slogan",
      "subtitle",
      "UI overlay",
      "logo icon",
      "frame",
      "border",
      "blur",
      "cropped",
      "low resolution"
    ]
  },
  "aspectRatio": "16:9",
  "imageSize": "2K"
}
```

命令（示例）：
```bash
node skills/taptap-game-publish-materials/tools/nano-bananapro-generate-image.mjs \
  --input ./image-spec.json \
  --out ./output/发布物料_YYYYMMDD/04-宣传图_16x9/hero.png
```

##### B. 用户选择 **通用对话类 AI（ChatGPT / Gemini / 豆包等）**

**要求：输出纯语言 prompt**，让用户在对应 AI 中直接粘贴生成，然后把生成结果放回指定文件夹。

- 交付物必须包含：
  - 一段可直接粘贴的 prompt（纯文本）
  - 明确告诉用户：保存为哪个文件名、放到哪个输出目录
  - 如果该工具支持“参数/尺寸/比例”的单独字段，也要在文字里明确写出“尺寸/比例/格式”

##### C. 用户选择 **Midjourney / Stable Diffusion 等**

**要求：输出最适配该工具的提示词格式**（例如 MJ 需要 `--ar`、SD 常用 negative prompt/采样参数等；若用户未提供参数偏好，则只给“最关键且不容易误解”的参数），并要求用户将结果导出为符合规则的尺寸/格式后回填目录。

- 交付物必须包含：
  - Prompt（含该工具常用参数写法）
  - 必须满足的导出要求（尺寸/比例/格式/大小限制）
  - 回填路径与文件名

---

### 外部生图服务配置

#### 支持的服务
- Gemini Imagen API（仓库内置脚本）
- 其他兼容服务

#### 配置步骤

1. 复制配置模板：
```bash
cp skills/taptap-game-publish-materials/.env.local.example .env.local
```

2. 编辑 `.env.local`，填写：
```env
GEMINI_API_KEY=your_api_key_here
GEMINI_IMAGE_MODEL=gemini-3-pro-image-preview  # 可选
GEMINI_BASE_URL=https://generativelanguage.googleapis.com  # 可选
```

3. 调用生图脚本：
```bash
node skills/taptap-game-publish-materials/tools/nano-bananapro-generate-image.mjs \
  --input ./image-spec.json \
  --out ./output/发布物料_YYYYMMDD/04-宣传图_16x9/hero.png
```

**image-spec.json 示例：**
```json
{
  "prompt": "游戏宣传图，16:9，赛博朋克风格，包含游戏标题'XXX'，不得出现标题以外的文字",
  "aspectRatio": "16:9",
  "imageSize": "2K"
}
```

---

### 输出目录结构

```
output/发布物料_YYYYMMDD/
  00-清单与校验/
    校验报告.html          # 可视化报告（包含图片预览、提交清单、一键复制）
    物料清单.md
  01-图标/
  02-截图/
  03-实机录屏/
  04-宣传图_16x9/
  05-宣传图_1x1/
  06-宣传片/
  07-首页推荐语/
  08-首页编辑推荐位素材/
  09-PC主机素材/
    LOGO/
    横版封面/
    竖版封面/
    游戏库背景壁纸/
  10-测试服信息/
```

---

### 校验报告格式（HTML 可视化报告）

生成 `00-清单与校验/校验报告.html`。

**使用模板：** 参考 `templates/report-template.html` 作为标准模板，确保样式和功能一致。

**必须包含以下内容：**

**核心功能要求：**

1. **按 TapTap 填写顺序排列**：
   - 游戏名称 → 游戏简介 → 开发者的话 → 更新日志
   - 游戏图标 → 游戏截图 → 实机录屏
   - 宣传图 16:9 → 宣传图 1:1 → 宣传片
   - 首页推荐语 → PC/主机素材 → 编辑推荐位素材

2. **图文并茂**：
   - 所有图片素材显示缩略图预览（点击放大）
   - 所有文本物料完整显示，带一键复制按钮

3. **侧边栏导航**：
   - 固定悬浮侧边栏，显示所有素材项
   - 滚动时自动高亮当前查看的素材
   - 点击快速跳转到对应素材

4. **问题项展开/收起**：
   - 有问题的素材卡片显示"发现 X 个警告项"
   - 点击可展开/收起查看详细问题和修复建议
   - 默认收起状态，保持页面简洁

5. **提交清单与映射**：
   - 每个素材明确标注 TapTap 后台位置
   - 格式：`游戏信息 > 基础信息 > 游戏图标`
   - 包含文件路径、规格说明、校验状态

**模板使用说明：**
- 完整的 HTML 模板见 `templates/report-template.html`
- 生成报告时，读取模板并替换实际数据
- 保持样式、布局和交互功能一致
- TapTap 品牌配色已在模板中预设（主色 #00D9C5、星空蓝 #000050、幻象紫 #7364FF）

---

## 核心原则

1. **不臆测内容**：严禁根据常识推断游戏内容，仅引用用户提供的资料
2. **优先复用**：始终优先使用已有素材，避免不必要的生成
3. **自动化优先**：自动读取模式下，尽量自动完成所有步骤
4. **检测优先**：生成图片前，先检测内置生图能力
5. **结构化输出**：统一整理到标准目录结构
6. **详细校验**：依据 `rules.md` 逐项校验，明确问题和修复建议
7. **可视化报告**：使用 `templates/report-template.html` 生成图文并茂的 HTML 报告
8. **提问引用规则**：问询式模式下，每次提问都从 `rules.md` 引用对应规则
9. **安全区域处理**：生图时安全区域仍需完整绘制，不使用模糊/截断/边框等糊弄

## 规则文档

所有 TapTap 平台的具体规则（尺寸、格式、内容限制等）详见 `rules.md`。
