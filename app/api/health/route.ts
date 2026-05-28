import { NextResponse } from "next/server";

export const runtime = "nodejs";

export function GET() {
  const hasDeepSeek = Boolean(process.env.DEEPSEEK_API_KEY);
  const hasOpenAI = Boolean(process.env.OPENAI_API_KEY);

  return NextResponse.json({
    ok: true,
    aiConfigured: hasDeepSeek || hasOpenAI,
    provider: hasDeepSeek ? "DeepSeek" : hasOpenAI ? "OpenAI" : null
  });
}
