import type { XiaohongshuInput } from "@/types/xiaohongshu";

const styleRules: Record<XiaohongshuInput["style"], string> = {
  "大雪风格：克制、真实、有洞察、不硬广":
    "克制、真实、有洞察，不堆形容词，不喊口号，不硬广。像一个成熟创业者在复盘自己的观察。",
  "爆款风格：标题强、痛点明显、适合涨粉":
    "标题更有冲突和记忆点，痛点更明确，但正文仍然自然可信，不夸张承诺。",
  "反认知风格：观点锋利、有创业洞察":
    "开头给出一个反常识观点，再解释背后的商业逻辑和创业者视角，避免为了反对而反对。",
  "案例成交风格：适合客户结果、转化、报喜":
    "突出客户变化、结果和信任感，可以轻轻带出产品价值，但不要赤裸裸卖课或逼单。",
  "人设故事风格：适合讲经历、转折、成长":
    "写出真实经历、转折和选择，让读者看到这个人为什么值得信任。"
};

export function buildXiaohongshuPrompt(input: XiaohongshuInput) {
  return [
    {
      role: "system" as const,
      content: `你是一个擅长小红书内容创作和创业者 IP 表达的文案助手。

你需要根据用户输入的信息，生成适合小红书发布的创业者笔记。

写作要求：
- 不要写得像广告。
- 不要太鸡汤。
- 不要用很夸张的营销话术。
- 要像真实创业者在分享自己的观察、经验、案例和思考。
- 标题要有吸引力，但不能低俗夸张。
- 正文要有结构，有情绪，有观点。
- 内容要帮助创业者表达专业度、建立信任，并根据发布目的自然促进转化。
- 话题标签必须适合小红书，数量 5-8 个。

输出格式必须是 JSON，不要输出 Markdown，不要包裹代码块。JSON 字段必须包括：
{
  "titles": ["标题1", "标题2", "标题3", "标题4", "标题5"],
  "coverTitles": ["封面标题1", "封面标题2", "封面标题3"],
  "body": "完整小红书正文",
  "hashtags": ["话题1", "话题2", "话题3"],
  "commentGuide": "评论区引导语",
  "dmGuide": "私信引导语",
  "contentAnalysis": "内容点评"
}`
    },
    {
      role: "user" as const,
      content: `请根据以下业务信息生成一套小红书创业者笔记。

我的身份/人设：${input.persona}
我的行业：${input.industry}
我的目标客户：${input.targetCustomer}
我的产品/服务：${input.product}
产品价格：${input.price}
今天想写的主题：${input.topic}
笔记目的：${input.goal}
写作风格：${input.style}
风格执行要求：${styleRules[input.style]}
补充素材：${input.extraMaterial || "无"}

请确保：
1. 给出 5 个小红书标题。
2. 给出 3 个封面标题，适合放在封面图上，短、有钩子、不拥挤。
3. 正文像真人创业者分享，不要像 AI 说明文。
4. 结尾的评论区引导和私信引导都要自然，不要压迫感。
5. 内容点评要说明这篇笔记适合什么场景，以及主要打的是人设、信任、观点还是转化。`
    }
  ];
}
