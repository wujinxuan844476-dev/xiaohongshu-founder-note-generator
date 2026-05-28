"use client";

import { useEffect, useRef, useState } from "react";
import { HistoryPanel } from "@/components/HistoryPanel";
import { InputForm } from "@/components/InputForm";
import { ResultDisplay } from "@/components/ResultDisplay";
import { noteGoals, writingStyles, type GenerateNoteResponse, type HistoryRecord, type XiaohongshuInput, type XiaohongshuResult } from "@/types/xiaohongshu";

const storageKey = "xhs-entrepreneur-note-history";

const initialForm: XiaohongshuInput = {
  persona: "",
  industry: "",
  targetCustomer: "",
  product: "",
  price: "",
  topic: "",
  goal: noteGoals[1],
  style: writingStyles[0],
  extraMaterial: ""
};

function readStoredHistory() {
  try {
    if (typeof window === "undefined" || !window.localStorage) return [];
    const saved = window.localStorage.getItem(storageKey);
    if (!saved) return [];
    const parsed = JSON.parse(saved) as HistoryRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeStoredHistory(records: HistoryRecord[]) {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem(storageKey, JSON.stringify(records));
    }
  } catch {
    // Some embedded browsers disable localStorage. The in-memory history still works.
  }
}

export function XiaohongshuGenerator() {
  const [form, setForm] = useState<XiaohongshuInput>(initialForm);
  const [result, setResult] = useState<XiaohongshuResult | null>(null);
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [activeHistoryId, setActiveHistoryId] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHistory(readStoredHistory());
  }, []);

  function persistHistory(nextHistory: HistoryRecord[]) {
    setHistory(nextHistory);
    writeStoredHistory(nextHistory);
  }

  function validateForm() {
    const missingLabels = [
      ["persona", "身份/人设"],
      ["industry", "行业"],
      ["targetCustomer", "目标客户"],
      ["product", "产品/服务"],
      ["price", "产品价格"],
      ["topic", "笔记主题"]
    ].filter(([field]) => !form[field as keyof XiaohongshuInput]?.trim());

    if (missingLabels.length) {
      return `请先补充：${missingLabels.map(([, label]) => label).join("、")}。`;
    }

    return "";
  }

  async function submit() {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = (await response.json()) as GenerateNoteResponse & { error?: string };

      if (!response.ok) {
        throw new Error(data.error || "生成失败，请稍后重试。");
      }

      setResult(data.result);
      const record: HistoryRecord = {
        id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Date.now()),
        createdAt: new Date().toISOString(),
        topic: form.topic,
        style: form.style,
        titles: data.result.titles,
        body: data.result.body,
        input: form,
        result: data.result
      };
      setActiveHistoryId(record.id);
      persistHistory([record, ...history].slice(0, 30));
      window.setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "生成失败，请稍后重试。");
    } finally {
      setLoading(false);
    }
  }

  function selectHistory(record: HistoryRecord) {
    setActiveHistoryId(record.id);
    setForm(record.input);
    setResult(record.result);
    window.setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 40);
  }

  function deleteHistory(id: string) {
    const nextHistory = history.filter((record) => record.id !== id);
    persistHistory(nextHistory);
    if (activeHistoryId === id) {
      setActiveHistoryId(undefined);
    }
  }

  return (
    <main className="min-h-screen px-4 pb-10 pt-24 md:px-6">
      <div className="mx-auto max-w-7xl">
        <section className="mb-8">
          <div className="max-w-4xl">
            <p className="text-sm font-semibold text-rose">创业者内容工具</p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight text-ink md:text-6xl">小红书创业者笔记生成器</h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-ink/66 md:text-lg">
              给创业者、个人IP和实体老板用的内容生产工具。输入你的业务信息，一键生成能建立信任、表达专业、促进转化的小红书笔记。
            </p>
          </div>
        </section>

        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="space-y-5">
            <InputForm form={form} loading={loading} error={error} onChange={setForm} onSubmit={submit} />
            <HistoryPanel records={history} activeId={activeHistoryId} onSelect={selectHistory} onDelete={deleteHistory} />
          </div>
          <div ref={resultRef}>
            <ResultDisplay result={result} />
          </div>
        </div>
      </div>
    </main>
  );
}
