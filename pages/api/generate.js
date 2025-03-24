export default async function handler(req, res) {
  const { input, type } = req.body;

  const prompt = type === 'quiz'
    ? `请根据以下内容生成3道选择题（含问题、选项、正确答案和解析），并用JSON格式返回，例如：
{
  "questions": [
    {
      "question": "什么是未来价值？",
      "options": ["今天的钱", "明年的钱", "经过利率增长后的金额", "没有变化"],
      "answer": "经过利率增长后的金额",
      "explanation": "未来价值是基于复利计算的结果"
    },
    ...
  ]
}
内容如下：\n${input}`
    : `你是CFA一级考试AI助手。请根据以下内容总结：\n- 核心概念\n- 必背公式\n- 高频考点\n- 示例解释\n${input}`;

  const response = await fetch("https://open.bigmodel.cn/api/paas/v4/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.ZHIPU_API_KEY}`,
    },
    body: JSON.stringify({
      model: "glm-4",
      messages: [{ role: "user", content: prompt }]
    }),
  });

  const data = await response.json();
  const result = data.choices?.[0]?.message?.content || "生成失败";

  res.status(200).json({ result });
}