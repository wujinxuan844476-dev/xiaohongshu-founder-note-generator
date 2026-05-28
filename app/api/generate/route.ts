import OpenAI from "openai";
import { NextResponse } from "next/server";
import { buildXiaohongshuPrompt } from "@/lib/xiaohongshuPrompt";
import { noteGoals, writingStyles, type XiaohongshuInput, type XiaohongshuResult } from "@/types/xiaohongshu";

export const runtime = "nodejs";
export const maxDuration = 30;

const rateLimitStore = new Map<string, { count: number; resetAt: number }>();
const rateLimitWindowMs = 60_000;
const rateLimitMaxRequests = 6;

const requiredFields: Array<keyof Pick<XiaohongshuInput, "persona" | "industry" | "targetCustomer" | "product" | "price" | "topic">> = [
  "persona",
  "industry",
  "targetCustomer",
  "product",
  "price",
  "topic"
];

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function getClientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip") || "unknown";
}

function checkRateLimit(key: string) {
  const now = Date.now();
  const current = rateLimitStore.get(key);

  if (!current || current.resetAt <= now) {
    rateLimitStore.set(key, { count: 1, resetAt: now + rateLimitWindowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (current.count >= rateLimitMaxRequests) {
    return { allowed: false, retryAfterSeconds: Math.ceil((current.resetAt - now) / 1000) };
  }

  current.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}

function validateInput(payload: unknown): XiaohongshuInput {
  const value = payload as Partial<XiaohongshuInput>;
  const input: XiaohongshuInput = {
    persona: asString(value.persona),
    industry: asString(value.industry),
    targetCustomer: asString(value.targetCustomer),
    product: asString(value.product),
    price: asString(value.price),
    topic: asString(value.topic),
    goal: value.goal as XiaohongshuInput["goal"],
    style: value.style as XiaohongshuInput["style"],
    extraMaterial: asString(value.extraMaterial)
  };

  const missing = requiredFields.filter((field) => !input[field]);
  if (missing.length) {
    throw new Error("请补充身份、行业、客户、产品、价格和主题后再生成。");
  }

  if (!noteGoals.includes(input.goal)) {
    throw new Error("请选择有效的笔记目的。");
  }

  if (!writingStyles.includes(input.style)) {
    throw new Error("请选择有效的写作风格。");
  }

  if (`${input.persona}${input.industry}${input.targetCustomer}${input.product}${input.price}${input.topic}${input.extraMaterial}`.length > 3200) {
    throw new Error("输入内容太长了，请先精简补充素材。");
  }

  return input;
}

function cleanJson(content: string) {
  return content
    .trim()
    .replace(/^```json/i, "")
    .replace(/^```/, "")
    .replace(/```$/, "")
    .trim();
}

function stringArray(value: unknown, maxLength: number) {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, maxLength);
}

function parseResult(content: string): XiaohongshuResult {
  const parsed = JSON.parse(cleanJson(content)) as Partial<XiaohongshuResult>;
  const result: XiaohongshuResult = {
    titles: stringArray(parsed.titles, 5),
    coverTitles: stringArray(parsed.coverTitles, 3),
    body: asString(parsed.body),
    hashtags: stringArray(parsed.hashtags, 8).map((tag) => (tag.startsWith("#") ? tag : `#${tag}`)),
    commentGuide: asString(parsed.commentGuide),
    dmGuide: asString(parsed.dmGuide),
    contentAnalysis: asString(parsed.contentAnalysis)
  };

  if (result.titles.length < 5 || result.coverTitles.length < 3 || !result.body || !result.commentGuide || !result.dmGuide) {
    throw new Error("模型返回内容不完整，请再试一次。");
  }

  return result;
}

/** 将 OpenAI SDK 抛出的原始错误转换成对用户友好的中文提示 */
function friendlyErrorMessage(error: unknown): string {
  // 用户输入校验错误直接透传
  if (error instanceof Error) {
    const knownMessages = [
      "请补充身份",
      "请选择有效",
      "输入内容太长",
      "模型返回内容不完整",
      "模型没有返回内容"
    ];
    if (knownMessages.some((m) => error.message.startsWith(m))) {
      return error.message;
    }
  }

  // OpenAI SDK 错误对象带有 status 属性
  const status = (error as { status?: number })?.status;
  if (status === 401 || status === 403) return "AI Key 配置错误，请检查服务端环境变量";
  if (status === 429) {
    const msg = (error as { message?: string })?.message ?? "";
    if (/quota|billing|insufficient/i.test(msg)) return "当前 AI 额度不足，请检查模型平台余额";
    return "请求太频繁，请稍后再试";
  }

  // 记录原始错误供排查（不含 Key 内容）
  if (error instanceof Error) {
    const safeMsg = error.message.replace(/sk-[A-Za-z0-9-_]+/g, "sk-***");
    console.error("[generate] AI error:", safeMsg);
  }

  return "生成失败，请稍后重试";
}

/** 根据环境变量构建 AI 客户端，DeepSeek 优先，fallback 到 OpenAI */
function buildAIClient(): { client: OpenAI; model: string; provider: string } {
  const deepseekKey = process.env.DEEPSEEK_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  if (deepseekKey) {
    return {
      client: new OpenAI({
        apiKey: deepseekKey,
        baseURL: "https://api.deepseek.com"
      }),
      model: process.env.DEEPSEEK_MODEL || "deepseek-chat",
      provider: "DeepSeek"
    };
  }

  if (openaiKey) {
    return {
      client: new OpenAI({ apiKey: openaiKey }),
      model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
      provider: "OpenAI"
    };
  }

  return { client: null as unknown as OpenAI, model: "", provider: "" };
}

export async function POST(request: Request) {
  let input: XiaohongshuInput;
  try {
    const rateLimit = checkRateLimit(getClientIp(request));
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: `请求太频繁，请 ${rateLimit.retryAfterSeconds} 秒后再试。` },
        { status: 429 }
      );
    }

    input = validateInput(await request.json());
  } catch (error) {
    const message = error instanceof Error ? error.message : "请求参数错误";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const { client, model, provider } = buildAIClient();

  if (!client) {
    return NextResponse.json(
      { error: "AI Key 配置错误，请检查服务端环境变量（DEEPSEEK_API_KEY 或 OPENAI_API_KEY）" },
      { status: 500 }
    );
  }

  try {
    console.log(`[generate] 使用 ${provider} / ${model}`);

    const completion = await client.chat.completions.create({
      model,
      temperature: 0.78,
      max_tokens: 2400,
      response_format: { type: "json_object" },
      messages: buildXiaohongshuPrompt(input)
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error("模型没有返回内容，请稍后重试。");
    }

    return NextResponse.json({ result: parseResult(content) });
  } catch (error) {
    return NextResponse.json({ error: friendlyErrorMessage(error) }, { status: 400 });
  }
}
