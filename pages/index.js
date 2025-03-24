import { useState, useEffect } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [type, setType] = useState('summary');
  const [output, setOutput] = useState('');
  const [wrongBook, setWrongBook] = useState(() => {
    if (typeof window !== 'undefined') {
      return JSON.parse(localStorage.getItem('wrongBook') || '[]');
    }
    return [];
  });

  const handleGenerate = async () => {
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input, type }),
    });
    const data = await res.json();
    setOutput(data.result);

    if (type === 'quiz') {
      const wrongEntry = {
        question: input,
        analysis: data.result,
        date: new Date().toISOString().split('T')[0],
      };
      const updated = [...wrongBook, wrongEntry];
      setWrongBook(updated);
      localStorage.setItem('wrongBook', JSON.stringify(updated));
    }
  };

  return (
    <main style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1>CFA AI 学习助理 (含错题本)</h1>
      <textarea rows={8} value={input} onChange={e => setInput(e.target.value)} placeholder="粘贴教材或题目..." style={{ width: '100%', marginBottom: 12 }} />
      <div>
        <label><input type="radio" value="summary" checked={type === 'summary'} onChange={() => setType('summary')} /> 总结笔记</label>
        <label style={{ marginLeft: 12 }}><input type="radio" value="quiz" checked={type === 'quiz'} onChange={() => setType('quiz')} /> 出题测试</label>
      </div>
      <button onClick={handleGenerate} style={{ marginTop: 12 }}>生成</button>
      <pre style={{ whiteSpace: 'pre-wrap', backgroundColor: '#f4f4f4', padding: 12, marginTop: 24 }}>{output}</pre>

      <h2 style={{ marginTop: 48 }}>📘 我的错题本</h2>
      {wrongBook.length === 0 && <p>暂无记录</p>}
      {wrongBook.map((item, index) => (
        <div key={index} style={{ marginTop: 12, background: '#eef', padding: 12 }}>
          <strong>题目：</strong>{item.question}<br />
          <strong>分析：</strong>{item.analysis}<br />
          <strong>记录时间：</strong>{item.date}
        </div>
      ))}
    </main>
  );
}