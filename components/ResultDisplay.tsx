"use client";

import { Check, Clipboard, FileText, MessageCircle, Tags } from "lucide-react";
import { useState } from "react";
import type { XiaohongshuResult } from "@/types/xiaohongshu";

type ResultDisplayProps = {
  result: XiaohongshuResult | null;
};

export function ResultDisplay({ result }: ResultDisplayProps) {
  const [copiedKey, setCopiedKey] = useState("");

  async function copyText(key: string, text: string) {
    await navigator.clipboard.writeText(text);
    setCopiedKey(key);
    window.setTimeout(() => setCopiedKey(""), 1300);
  }

  if (!result) {
    return (
      <section className="flex min-h-[520px] items-center justify-center rounded-lg border border-dashed border-rose-200 bg-white/66 px-6 text-center">
        <div>
          <p className="text-sm font-medium text-rose">等待生成</p>
          <h2 className="mt-2 text-2xl font-semibold text-ink">一套完整的小红书笔记会出现在这里</h2>
          <p className="mt-3 max-w-md text-sm leading-7 text-ink/58">包含标题、封面文案、正文、标签、评论引导、私信引导和内容点评。</p>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <ResultBlock title="5个小红书标题" icon={<FileText size={18} />} onCopy={() => copyText("titles", result.titles.join("\n"))} copied={copiedKey === "titles"}>
        <ol className="space-y-2">
          {result.titles.map((title, index) => (
            <li key={title} className="flex gap-3 text-sm leading-7 text-ink/78">
              <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blush text-xs font-semibold text-rose">{index + 1}</span>
              <span>{title}</span>
            </li>
          ))}
        </ol>
      </ResultBlock>

      <ResultBlock
        title="3个封面标题"
        icon={<FileText size={18} />}
        onCopy={() => copyText("coverTitles", result.coverTitles.join("\n"))}
        copied={copiedKey === "coverTitles"}
      >
        <div className="grid gap-2 md:grid-cols-3">
          {result.coverTitles.map((title) => (
            <div key={title} className="rounded-md border border-rose-100 bg-blush/60 px-3 py-3 text-center text-sm font-semibold leading-6 text-ink">
              {title}
            </div>
          ))}
        </div>
      </ResultBlock>

      <ResultBlock title="完整小红书正文" icon={<FileText size={18} />} onCopy={() => copyText("body", result.body)} copied={copiedKey === "body"}>
        <p className="whitespace-pre-wrap text-sm leading-7 text-ink/78">{result.body}</p>
      </ResultBlock>

      <ResultBlock title="话题标签" icon={<Tags size={18} />} onCopy={() => copyText("hashtags", result.hashtags.join(" "))} copied={copiedKey === "hashtags"}>
        <div className="flex flex-wrap gap-2">
          {result.hashtags.map((tag) => (
            <span key={tag} className="rounded-full border border-rose-100 bg-white px-3 py-1 text-sm text-rose">
              {tag}
            </span>
          ))}
        </div>
      </ResultBlock>

      <div className="grid gap-4 md:grid-cols-2">
        <ResultBlock
          title="评论区引导"
          icon={<MessageCircle size={18} />}
          onCopy={() => copyText("commentGuide", result.commentGuide)}
          copied={copiedKey === "commentGuide"}
        >
          <p className="text-sm leading-7 text-ink/78">{result.commentGuide}</p>
        </ResultBlock>
        <ResultBlock title="私信引导" icon={<MessageCircle size={18} />} onCopy={() => copyText("dmGuide", result.dmGuide)} copied={copiedKey === "dmGuide"}>
          <p className="text-sm leading-7 text-ink/78">{result.dmGuide}</p>
        </ResultBlock>
      </div>

      <ResultBlock
        title="内容点评"
        icon={<FileText size={18} />}
        onCopy={() => copyText("contentAnalysis", result.contentAnalysis)}
        copied={copiedKey === "contentAnalysis"}
      >
        <p className="whitespace-pre-wrap text-sm leading-7 text-ink/78">{result.contentAnalysis}</p>
      </ResultBlock>
    </section>
  );
}

function ResultBlock({
  title,
  icon,
  copied,
  onCopy,
  children
}: {
  title: string;
  icon: React.ReactNode;
  copied: boolean;
  onCopy: () => void;
  children: React.ReactNode;
}) {
  return (
    <article className="rounded-lg border border-rose-100 bg-white/86 p-4 shadow-soft backdrop-blur md:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="flex items-center gap-2 text-base font-semibold text-ink">
          <span className="text-rose">{icon}</span>
          {title}
        </h3>
        <button
          type="button"
          title={`复制${title}`}
          onClick={onCopy}
          className="inline-flex h-9 items-center gap-2 rounded-md border border-black/10 bg-white px-3 text-sm font-medium text-ink transition hover:border-rose hover:text-rose"
        >
          {copied ? <Check size={15} /> : <Clipboard size={15} />}
          {copied ? "已复制" : "复制"}
        </button>
      </div>
      {children}
    </article>
  );
}
