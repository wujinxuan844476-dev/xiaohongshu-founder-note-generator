"use client";

import { Loader2, Sparkles } from "lucide-react";
import { noteGoals, writingStyles, type XiaohongshuInput } from "@/types/xiaohongshu";

type InputFormProps = {
  form: XiaohongshuInput;
  loading: boolean;
  error: string;
  onChange: (form: XiaohongshuInput) => void;
  onSubmit: () => void;
};

const fieldHelp: Record<keyof Pick<XiaohongshuInput, "persona" | "industry" | "targetCustomer" | "product" | "price" | "topic">, string> = {
  persona: "如：IP孵化教练、实体店老板、医美咨询师",
  industry: "如：知识付费、医美、服装店、心理咨询",
  targetCustomer: "如：想获客的实体老板、想做IP的创业者",
  product: "如：IP陪跑、私域训练营、咨询服务",
  price: "如：399、1999、9800、3万、10万",
  topic: "如：为什么普通人做IP不要一上来追求爆款"
};

export function InputForm({ form, loading, error, onChange, onSubmit }: InputFormProps) {
  function updateField<Key extends keyof XiaohongshuInput>(field: Key, value: XiaohongshuInput[Key]) {
    onChange({ ...form, [field]: value });
  }

  return (
    <section className="rounded-lg border border-rose-100 bg-white/86 p-4 shadow-soft backdrop-blur md:p-5">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-rose">输入区</p>
          <h2 className="mt-1 text-xl font-semibold text-ink">你的业务信息</h2>
        </div>
        <span className="rounded-full bg-blush px-3 py-1 text-xs font-medium text-rose">MVP</span>
      </div>

      <div className="space-y-4">
        <TextField label="我的身份/人设" value={form.persona} placeholder={fieldHelp.persona} onChange={(value) => updateField("persona", value)} />
        <TextField label="我的行业" value={form.industry} placeholder={fieldHelp.industry} onChange={(value) => updateField("industry", value)} />
        <TextField
          label="我的目标客户"
          value={form.targetCustomer}
          placeholder={fieldHelp.targetCustomer}
          onChange={(value) => updateField("targetCustomer", value)}
        />
        <TextField label="我的产品/服务" value={form.product} placeholder={fieldHelp.product} onChange={(value) => updateField("product", value)} />
        <TextField label="产品价格" value={form.price} placeholder={fieldHelp.price} onChange={(value) => updateField("price", value)} />
        <TextField label="今天想写的主题" value={form.topic} placeholder={fieldHelp.topic} onChange={(value) => updateField("topic", value)} />

        <div className="grid gap-4 md:grid-cols-2">
          <SelectField
            label="笔记目的"
            value={form.goal}
            options={noteGoals}
            onChange={(value) => updateField("goal", value as XiaohongshuInput["goal"])}
          />
          <SelectField
            label="写作风格"
            value={form.style}
            options={writingStyles}
            onChange={(value) => updateField("style", value as XiaohongshuInput["style"])}
          />
        </div>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-ink">补充素材</span>
          <textarea
            value={form.extraMaterial}
            onChange={(event) => updateField("extraMaterial", event.target.value)}
            className="min-h-32 w-full resize-y rounded-md border border-black/10 bg-paper px-3 py-3 text-sm leading-6 text-ink outline-none transition placeholder:text-ink/35 focus:border-rose focus:ring-2 focus:ring-rose/10"
            placeholder="可以粘贴真实案例、聊天记录、观点、经历、想表达的情绪等。"
          />
        </label>

        {error ? <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm leading-6 text-red-700">{error}</p> : null}

        <button
          type="button"
          onClick={onSubmit}
          disabled={loading}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-rose px-5 text-base font-semibold text-white shadow-[0_16px_34px_rgba(218,58,108,0.22)] transition hover:bg-roseDark disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
          {loading ? "正在生成..." : "生成小红书笔记"}
        </button>
      </div>
    </section>
  );
}

function TextField({ label, value, placeholder, onChange }: { label: string; value: string; placeholder: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-ink">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-md border border-black/10 bg-paper px-3 text-sm text-ink outline-none transition placeholder:text-ink/35 focus:border-rose focus:ring-2 focus:ring-rose/10"
        placeholder={placeholder}
      />
    </label>
  );
}

function SelectField({ label, value, options, onChange }: { label: string; value: string; options: readonly string[]; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-ink">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-md border border-black/10 bg-paper px-3 text-sm text-ink outline-none transition focus:border-rose focus:ring-2 focus:ring-rose/10"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
