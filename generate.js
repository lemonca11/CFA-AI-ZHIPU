export default async function handler(req, res) {
  const { input, type } = req.body;

  const prompt = type === 'quiz'
    ? `根据以下内容，生成3道选择题，每题含正确答案及解释：\n${input}`
    : `你是CFA一级考试的AI学习助手。请根据以下内容生成总结：\n- 核心概念\n- 必背公式\n- 高频考点\n- 示例解释\n${input}`;

  const response = await fetch("https://open.bigmodel.cn/api/paas/v4/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.ZHIPU_API_KEY}`,
    },
    body: JSON.stringify({
      model: "glm-4",
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const data = await response.json();
  const result = data.choices?.[0]?.message?.content || "生成失败";

  res.status(200).json({ result });
}