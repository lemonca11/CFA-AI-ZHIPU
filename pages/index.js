import { useState } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [type, setType] = useState('summary');
  const [output, setOutput] = useState('');

  const handleGenerate = async () => {
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input, type }),
    });
    const data = await res.json();
    setOutput(data.result);
  };

  return (
    <main style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1>CFA AI 学习助理 (智谱版)</h1>
      <textarea rows={10} value={input} onChange={e => setInput(e.target.value)} placeholder="请粘贴CFA教材内容..." style={{ width: '100%', marginBottom: 12 }} />
      <div>
        <label><input type="radio" value="summary" checked={type === 'summary'} onChange={() => setType('summary')} /> 总结笔记</label>
        <label style={{ marginLeft: 12 }}><input type="radio" value="quiz" checked={type === 'quiz'} onChange={() => setType('quiz')} /> 出题测试</label>
      </div>
      <button onClick={handleGenerate} style={{ marginTop: 12 }}>生成</button>
      <pre style={{ whiteSpace: 'pre-wrap', backgroundColor: '#f4f4f4', padding: 12, marginTop: 24 }}>{output}</pre>
    </main>
  );
}