# 上线部署清单

## 推荐路径：Vercel

1. 把项目上传到 GitHub。
2. 在 Vercel 新建项目，选择这个仓库。
3. Framework Preset 选择 `Next.js`。
4. Build Command 使用默认值：`npm run build`。
5. Output Directory 留空。
6. 在 Vercel 的 `Project Settings -> Environment Variables` 添加环境变量。

## 环境变量

推荐先用 DeepSeek，OpenAI 作为备用：

```bash
DEEPSEEK_API_KEY=你的 DeepSeek API Key
DEEPSEEK_MODEL=deepseek-chat
```

或使用 OpenAI：

```bash
OPENAI_API_KEY=你的 OpenAI API Key
OPENAI_MODEL=gpt-4.1-mini
```

不要在变量名前加 `NEXT_PUBLIC_`。

## 部署后验证

打开：

```txt
https://你的域名/api/health
```

如果返回：

```json
{"ok":true,"aiConfigured":true}
```

说明服务端已经读取到 AI Key。

然后打开首页，填写一组示例内容，点击「生成小红书笔记」。

## 当前版本不包含

- 登录
- 付费
- 数据库
- 云端历史记录
- 小红书自动发布

这些可以在 MVP 跑通后继续加。
