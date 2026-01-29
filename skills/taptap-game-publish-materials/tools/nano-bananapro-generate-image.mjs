#!/usr/bin/env node
/**
 * Nano Banana Pro（Gemini 3 Pro Image）生图调用脚本（按 Gemini 官网 REST 规范）
 *
 * 用法：
 *   node skills/taptap-game-publish-materials/tools/nano-bananapro-generate-image.mjs \
 *     --input ./image-spec.json \
 *     --out ./output/发布物料_YYYYMMDD/04-宣传图_16x9/hero.png
 *
 * 也可以直接传 JSON 字符串：
 *   node ... --spec '{"prompt":"...","aspectRatio":"16:9","imageSize":"2K"}' --out ./out.png
 *
 * 官网文档（图片生成 / Nano Banana）：https://ai.google.dev/gemini-api/docs/image-generation
 *
 * REST Endpoint（示例）：
 *   POST https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image-preview:generateContent
 *   Header: x-goog-api-key: $GEMINI_API_KEY
 *
 * 环境变量（从 .env.local 或系统环境读取）：
 *   - GEMINI_API_KEY
 *   - GEMINI_BASE_URL (可选，默认 https://generativelanguage.googleapis.com)
 *   - GEMINI_IMAGE_MODEL (可选，默认 gemini-3-pro-image-preview)
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

function usageAndExit(code = 1, msg) {
  if (msg) console.error(msg);
  console.error(
    [
      "",
      "用法：",
      "  node skills/taptap-game-publish-materials/tools/nano-bananapro-generate-image.mjs --input <spec.json> --out <file.png>",
      "  node skills/taptap-game-publish-materials/tools/nano-bananapro-generate-image.mjs --spec  '<json>'    --out <file.png>",
      "",
      "spec.json 示例：",
      '  { "prompt": "......", "aspectRatio": "16:9", "imageSize": "2K" }',
      '  { "prompt": {"user_intent":"..."}, "aspectRatio": "16:9", "imageSize": "2K" }',
      "",
    ].join("\n"),
  );
  process.exit(code);
}

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith("--")) continue;
    const key = a.slice(2);
    const value = argv[i + 1];
    if (!value || value.startsWith("--")) args[key] = true;
    else {
      args[key] = value;
      i++;
    }
  }
  return args;
}

function fileExists(p) {
  try {
    fs.accessSync(p, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

function loadDotEnvFile(envPath) {
  if (!fileExists(envPath)) return false;
  const raw = fs.readFileSync(envPath, "utf8");
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    const k = trimmed.slice(0, idx).trim();
    let v = trimmed.slice(idx + 1).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    if (!(k in process.env)) process.env[k] = v;
  }
  return true;
}

function loadDotEnvLocal() {
  // 读取优先级：
  // 1) 当前运行目录 .env.local（方便用户在项目根目录放置）
  // 2) 脚本同目录的 .env.local（方便随 skill 一起放置）
  const cwdEnv = path.resolve(process.cwd(), ".env.local");
  if (loadDotEnvFile(cwdEnv)) return;

  const scriptDir = path.dirname(fileURLToPath(import.meta.url));
  const scriptEnv = path.resolve(scriptDir, "..", ".env.local");
  loadDotEnvFile(scriptEnv);
}

async function ensureDirForFile(filePath) {
  const dir = path.dirname(filePath);
  await fs.promises.mkdir(dir, { recursive: true });
}

function normalizeBaseUrl(baseUrl) {
  const u = baseUrl.replace(/\/+$/, "");
  return u;
}

function firstImageInlineData(json) {
  const parts = json?.candidates?.[0]?.content?.parts;
  if (!Array.isArray(parts)) return null;
  for (const p of parts) {
    const inline = p?.inlineData;
    if (inline?.data) return inline;
  }
  return null;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const outPath = args.out;
  const inputPath = args.input;
  const specJson = args.spec;

  if (!outPath) usageAndExit(1, "缺少 --out");
  if (!inputPath && !specJson) usageAndExit(1, "缺少 --input 或 --spec");
  if (inputPath && specJson) usageAndExit(1, "--input 与 --spec 只能二选一");

  loadDotEnvLocal();

  const apiKey = process.env.GEMINI_API_KEY;
  const baseUrl = process.env.GEMINI_BASE_URL || "https://generativelanguage.googleapis.com";
  const model = process.env.GEMINI_IMAGE_MODEL || "gemini-3-pro-image-preview";

  if (!apiKey) usageAndExit(1, "缺少环境变量 GEMINI_API_KEY（请在 .env.local 中填写）");

  let spec;
  try {
    if (inputPath) {
      const raw = fs.readFileSync(path.resolve(process.cwd(), inputPath), "utf8");
      spec = JSON.parse(raw);
    } else {
      spec = JSON.parse(specJson);
    }
  } catch (e) {
    usageAndExit(1, `spec 解析失败：${e?.message || String(e)}`);
  }

  const promptValue = spec.prompt;
  if (!promptValue) usageAndExit(1, "spec.prompt 必填");

  // prompt 支持：
  // - string：直接作为提示词
  // - object/array：自动 JSON.stringify（更适合 Nano Banana Pro 的结构化提示词）
  let promptText;
  if (typeof promptValue === "string") {
    promptText = promptValue;
  } else if (typeof promptValue === "object") {
    promptText = JSON.stringify(promptValue, null, 2);
  } else {
    usageAndExit(1, "spec.prompt 必须是 string 或 object/array");
  }

  // 按 Gemini 官网 REST 示例：
  // - contents.parts[].text
  // - generationConfig.responseModalities 可设为 ["IMAGE"] 仅返回图片
  // - generationConfig.imageConfig: { aspectRatio, imageSize }（主要用于 gemini-3-pro-image-preview）
  const body = {
    contents: [
      {
        parts: [{ text: promptText }],
      },
    ],
    generationConfig: {
      responseModalities: spec.responseModalities ?? ["IMAGE"],
      ...(spec.aspectRatio || spec.imageSize
        ? {
            imageConfig: {
              ...(spec.aspectRatio ? { aspectRatio: spec.aspectRatio } : null),
              ...(spec.imageSize ? { imageSize: spec.imageSize } : null),
            },
          }
        : null),
    },
  };

  const url = `${normalizeBaseUrl(baseUrl)}/v1beta/models/${encodeURIComponent(model)}:generateContent`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`请求失败：${res.status} ${res.statusText}\n${text}`);
  }

  const json = await res.json();
  if (json?.error) throw new Error(`请求失败：${JSON.stringify(json.error)}`);

  const inline = firstImageInlineData(json);
  const b64 = inline?.data;
  if (!b64) throw new Error("响应中未找到 candidates[0].content.parts[].inlineData.data（请确认该模型支持图片输出）");

  const buf = Buffer.from(b64, "base64");
  await ensureDirForFile(path.resolve(process.cwd(), outPath));
  fs.writeFileSync(path.resolve(process.cwd(), outPath), buf);

  console.log(`已生成：${outPath}`);
}

main().catch((e) => {
  console.error(e?.stack || String(e));
  process.exit(1);
});

