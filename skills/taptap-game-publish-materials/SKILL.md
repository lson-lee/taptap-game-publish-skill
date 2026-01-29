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

生成图片时，必须严格遵循以下规范：

**安全区域处理（关键）：**
- 安全区域（如宣传图上下 108px、图标 22% 圆角区）**仍需绘制完整内容**
- 安全区内避免放置关键视觉主体（LOGO、主角面部等）
- **禁止使用**：模糊效果、截断、黑白边框、渐变遮罩、留白等方式糊弄
- **正确做法**：在安全区绘制背景延伸、装饰元素、环境细节等次要内容，保持画面完整性

**Prompt 示例（宣传图 16:9）：**
```
游戏宣传图，1920x1080px，16:9 比例，赛博朋克风格。
画面构图：主角站在霓虹城市中央，游戏标题"XXX"位于画面中部偏上位置，标题清晰可读，占比不超过总面积 25%。
安全区域处理：上下各 108px 区域绘制城市天际线和地面延伸，不放置关键角色或文字。
画面完整性：整个画面无模糊、无截断、无边框，所有区域均有完整绘制。
禁止：除游戏标题外，不得出现任何其他文字、宣传语、标语。
```

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

生成 `00-清单与校验/校验报告.html`，包含以下内容：

#### 设计规范

**配色方案（使用 TapTap 品牌色）：**
- 主色：`#00D9C5`（TapTap 色，用于标题、按钮、链接）
- 星空蓝：`#000050`（用于深色背景）
- 幻象紫：`#7364FF`（用于强调、标签）
- 背景：`#FFFFFF`（主背景）/ `#F5F5F5`（次级背景）
- 文本：`#000000`（主文本）/ `#666666`（次级文本）

**功能要求：**
1. **图文并茂**：每个素材显示缩略图预览（点击放大）
2. **一键复制**：每个文本内容（简介、推荐语等）旁边有"复制"按钮
3. **提交清单**：明确每个素材对应 TapTap 后台的哪个上传位置
4. **校验结果**：清晰展示通过/警告/不通过项，带优先级标识

#### HTML 结构示例

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>TapTap 发布物料校验报告 - [游戏名称]</title>
  <style>
    :root {
      --taptap-primary: #00D9C5;
      --taptap-dark: #000050;
      --taptap-purple: #7364FF;
    }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
    .header { background: var(--taptap-dark); color: white; padding: 2rem; }
    .summary { background: #f5f5f5; padding: 1.5rem; border-radius: 8px; }
    .material-card { border: 1px solid #e0e0e0; border-radius: 8px; padding: 1rem; margin: 1rem 0; }
    .material-preview img { max-width: 200px; border-radius: 4px; cursor: pointer; }
    .copy-btn { background: var(--taptap-primary); color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; }
    .status-pass { color: #4CAF50; }
    .status-warn { color: #FF9800; }
    .status-fail { color: #F44336; }
    .priority-high { background: #F44336; color: white; padding: 0.25rem 0.5rem; border-radius: 4px; }
    .priority-medium { background: #FF9800; color: white; padding: 0.25rem 0.5rem; border-radius: 4px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>TapTap 发布物料校验报告</h1>
    <p>游戏名称：XXX | 生成时间：2026-01-30 14:30:00</p>
  </div>

  <div class="container">
    <!-- 校验摘要 -->
    <div class="summary">
      <h2>📋 校验摘要</h2>
      <p>✅ 通过项：8/12 | ⚠️ 警告项：3/12 | ❌ 不通过项：1/12</p>
    </div>

    <!-- 提交清单（对应 TapTap 后台位置） -->
    <section id="submit-checklist">
      <h2 style="color: var(--taptap-primary)">📤 提交清单与映射</h2>
      
      <div class="material-card">
        <h3>1. 游戏图标 ✅</h3>
        <div class="material-preview">
          <img src="../01-图标/icon.png" alt="游戏图标" onclick="openFullImage(this)">
        </div>
        <p><strong>TapTap 后台位置：</strong> 游戏信息 > 基础信息 > 游戏图标</p>
        <p><strong>文件：</strong> 01-图标/icon.png</p>
        <p><strong>规格：</strong> 1024x1024px, PNG, 符合要求</p>
      </div>

      <div class="material-card">
        <h3>2. 游戏截图 ⚠️</h3>
        <div class="material-preview">
          <img src="../02-截图/screenshot_01.png" alt="截图1">
          <img src="../02-截图/screenshot_02.png" alt="截图2">
          <img src="../02-截图/screenshot_03.png" alt="截图3">
        </div>
        <p><strong>TapTap 后台位置：</strong> 游戏信息 > 媒体素材 > 游戏截图</p>
        <p><strong>文件：</strong> 02-截图/*.png (共3张)</p>
        <p><strong>问题：</strong> screenshot_03.png 格式为 WebP，需转换为 PNG <span class="priority-high">🔴 必须修复</span></p>
      </div>

      <div class="material-card">
        <h3>3. 游戏简介</h3>
        <div style="background: #f5f5f5; padding: 1rem; border-radius: 4px; position: relative;">
          <p id="game-intro">这是一款XXX类型的游戏，玩家可以...</p>
          <button class="copy-btn" onclick="copyText('game-intro')">📋 复制</button>
        </div>
        <p><strong>TapTap 后台位置：</strong> 游戏信息 > 基础信息 > 游戏简介</p>
        <p><strong>字数：</strong> 123/500 字符 ✅</p>
      </div>

      <div class="material-card">
        <h3>4. 首页推荐语</h3>
        <div style="background: #f5f5f5; padding: 1rem; border-radius: 4px; position: relative;">
          <p id="recommendation">探索赛博朋克世界的冒险之旅</p>
          <button class="copy-btn" onclick="copyText('recommendation')">📋 复制</button>
        </div>
        <p><strong>TapTap 后台位置：</strong> 游戏信息 > 推荐信息 > 首页推荐语</p>
        <p><strong>字数：</strong> 13/25 字符 ✅</p>
      </div>

      <!-- 更多素材... -->
    </section>

    <!-- 校验问题详情 -->
    <section id="validation-issues">
      <h2 style="color: #F44336">⚠️ 需要修复的问题</h2>
      
      <div class="material-card" style="border-left: 4px solid #F44336;">
        <h3>❌ 游戏截图 3 - 格式错误 <span class="priority-high">必须修复</span></h3>
        <p><strong>问题描述：</strong> 文件格式为 WebP，TapTap 要求 JPG/PNG</p>
        <p><strong>影响：</strong> 无法上传，阻断上架流程</p>
        <p><strong>修复建议：</strong></p>
        <ol>
          <li>使用图像工具转换为 PNG 格式</li>
          <li>命令示例：<code>convert screenshot_03.webp screenshot_03.png</code></li>
          <li>确保转换后尺寸和清晰度不变</li>
        </ol>
      </div>

      <div class="material-card" style="border-left: 4px solid #FF9800;">
        <h3>⚠️ 宣传图 16:9 - 文本过大 <span class="priority-medium">建议修复</span></h3>
        <p><strong>问题描述：</strong> 游戏 LOGO 占图片面积约 35%，规范建议 < 25%</p>
        <p><strong>影响：</strong> 可能影响首页推荐通过率</p>
        <p><strong>修复建议：</strong> 缩小 LOGO 至图片高度的 1/4 左右</p>
      </div>
    </section>

    <!-- 问题汇总 -->
    <section id="summary">
      <h2>📊 问题汇总</h2>
      <ul>
        <li>🔴 <strong>必须修复（阻断上架）：</strong> 1 项</li>
        <li>🟠 <strong>强烈建议修复（影响审核）：</strong> 1 项</li>
        <li>🟡 <strong>建议优化（提升质量）：</strong> 1 项</li>
      </ul>
    </section>
  </div>

  <script>
    function copyText(elementId) {
      const text = document.getElementById(elementId).innerText;
      navigator.clipboard.writeText(text).then(() => {
        alert('已复制到剪贴板！');
      });
    }
    
    function openFullImage(img) {
      window.open(img.src, '_blank');
    }
  </script>
</body>
</html>
```

**HTML 报告必须包含：**
1. 使用 TapTap 品牌配色
2. 所有素材的图片预览（可点击放大）
3. 每个文本内容的一键复制按钮
4. 明确的 TapTap 后台位置映射
5. 清晰的问题分级和修复建议
6. 响应式设计，支持移动端查看

---

## 核心原则

1. **不臆测内容**：严禁根据常识推断游戏内容，仅引用用户提供的资料
2. **优先复用**：始终优先使用已有素材，避免不必要的生成
3. **自动化优先**：自动读取模式下，尽量自动完成所有步骤
4. **检测优先**：生成图片前，先检测内置生图能力
5. **结构化输出**：统一整理到标准目录结构
6. **详细校验**：依据 `rules.md` 逐项校验，明确问题和修复建议
7. **可视化报告**：生成图文并茂的 HTML 报告，包含图片预览、一键复制、提交清单
8. **提问引用规则**：问询式模式下，每次提问都从 `rules.md` 引用对应规则
9. **安全区域处理**：生图时安全区域仍需完整绘制，不使用模糊/截断/边框等糊弄

## 规则文档

所有 TapTap 平台的具体规则（尺寸、格式、内容限制等）详见 `rules.md`。
