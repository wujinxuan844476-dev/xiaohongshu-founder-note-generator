export const noteGoals = ["涨粉", "建立信任", "种草产品", "案例成交", "观点输出", "人设故事", "引导私信"] as const;

export const writingStyles = [
  "大雪风格：克制、真实、有洞察、不硬广",
  "爆款风格：标题强、痛点明显、适合涨粉",
  "反认知风格：观点锋利、有创业洞察",
  "案例成交风格：适合客户结果、转化、报喜",
  "人设故事风格：适合讲经历、转折、成长"
] as const;

export type NoteGoal = (typeof noteGoals)[number];
export type WritingStyle = (typeof writingStyles)[number];

export type XiaohongshuInput = {
  persona: string;
  industry: string;
  targetCustomer: string;
  product: string;
  price: string;
  topic: string;
  goal: NoteGoal;
  style: WritingStyle;
  extraMaterial: string;
};

export type XiaohongshuResult = {
  titles: string[];
  coverTitles: string[];
  body: string;
  hashtags: string[];
  commentGuide: string;
  dmGuide: string;
  contentAnalysis: string;
};

export type HistoryRecord = {
  id: string;
  createdAt: string;
  topic: string;
  style: WritingStyle;
  titles: string[];
  body: string;
  input: XiaohongshuInput;
  result: XiaohongshuResult;
};

export type GenerateNoteResponse = {
  result: XiaohongshuResult;
};
