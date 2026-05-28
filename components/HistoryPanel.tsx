"use client";

import { Clock3, Trash2 } from "lucide-react";
import type { HistoryRecord } from "@/types/xiaohongshu";

type HistoryPanelProps = {
  records: HistoryRecord[];
  activeId?: string;
  onSelect: (record: HistoryRecord) => void;
  onDelete: (id: string) => void;
};

export function HistoryPanel({ records, activeId, onSelect, onDelete }: HistoryPanelProps) {
  return (
    <section className="rounded-lg border border-rose-100 bg-white/78 p-4 shadow-soft backdrop-blur md:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-rose">历史记录</p>
          <h2 className="mt-1 text-xl font-semibold text-ink">最近生成</h2>
        </div>
        <span className="text-sm text-ink/45">{records.length} 条</span>
      </div>

      {records.length ? (
        <div className="space-y-2">
          {records.map((record) => (
            <div
              key={record.id}
              className={`rounded-md border px-3 py-3 transition ${
                activeId === record.id ? "border-rose bg-blush/70" : "border-black/10 bg-paper hover:border-rose/40"
              }`}
            >
              <button type="button" onClick={() => onSelect(record)} className="block w-full text-left">
                <span className="flex items-center gap-2 text-xs text-ink/48">
                  <Clock3 size={13} />
                  {new Date(record.createdAt).toLocaleString("zh-CN", { hour12: false })}
                </span>
                <strong className="mt-2 block text-sm font-semibold leading-6 text-ink">{record.topic}</strong>
                <span className="mt-1 block truncate text-xs text-ink/50">{record.style}</span>
                <span className="mt-2 block truncate text-sm text-ink/66">{record.titles[0]}</span>
              </button>
              <div className="mt-3 flex justify-end">
                <button
                  type="button"
                  title="删除这条历史"
                  onClick={() => onDelete(record.id)}
                  className="inline-flex h-8 items-center gap-1 rounded-md border border-black/10 bg-white px-2 text-xs font-medium text-ink/60 transition hover:border-red-200 hover:text-red-600"
                >
                  <Trash2 size={13} />
                  删除
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex min-h-32 items-center justify-center rounded-md border border-dashed border-rose-100 bg-paper px-4 text-center">
          <p className="text-sm leading-6 text-ink/50">生成成功后会自动保存到这里，刷新页面也还在。</p>
        </div>
      )}
    </section>
  );
}
