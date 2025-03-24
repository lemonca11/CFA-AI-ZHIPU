import { useState, useEffect } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [type, setType] = useState('summary');
  const [output, setOutput] = useState('');
  const [quiz, setQuiz] = useState([]);
  const [currentAnswer, setCurrentAnswer] = useState(null);
  const [wrongBook, setWrongBook] = useState(() => {
    if (typeof window !== 'undefined') {
      return JSON.parse(localStorage.getItem('wrongBook') || '[]');
    }
    return [];
  });

  const handleGenerate = async () => {
    setOutput('生成中...');
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input, type }),
    });
    const data = await res.json();
    if (type === 'quiz') {
      try {
        const parsed = JSON.parse(data.result);
        setQuiz(parsed.questions || []);
      } catch {
        setOutput(data.result);
      }
    } else {
      setOutput(data.result);
    }
  };

  const handleAnswer = (q, userChoice) => {
    const correct = q.answer;
    const isWrong = userChoice !== correct;
    setCurrentAnswer({ question: q.question, correct, userChoice, explanation: q.explanation });
    if (isWrong) {
      const wrongEntry = {
        question: q.question,
        userAnswer: userChoice,
        correctAnswer: correct,
        explanation: q.explanation,
        date: new Date().toISOString().split('T')[0]
      };
      const updated = [...wrongBook, wrongEntry];
      setWrongBook(updated);
      localStorage.setItem('wrongBook', JSON.stringify(updated));
    }
  };

  return (
    <main className="p-4 font-sans max-w-2xl mx-auto">
      <h1 className="text-xl font-bold mb-2 text-blue-700">CFA AI 学习助手 (v2)</h1>
      <textarea rows={6} value={input} onChange={e => setInput(e.target.value)}
        placeholder="粘贴教材内容或出题段落…" className="w-full p-2 border rounded mb-2" />
      <div className="mb-4">
        <label><input type="radio" value="summary" checked={type === 'summary'} onChange={() => setType('summary')} /> 总结笔记</label>
        <label className="ml-4"><input type="radio" value="quiz" checked={type === 'quiz'} onChange={() => setType('quiz')} /> 出题测试</label>
      </div>
      <button onClick={handleGenerate} className="bg-blue-600 text-white px-4 py-1 rounded">生成</button>

      {type === 'summary' && (
        <div className="mt-6 p-4 bg-gray-50 border rounded space-y-2 whitespace-pre-wrap">
          {output}
        </div>
      )}

      {type === 'quiz' && (
        <div className="mt-6 space-y-4">
          {quiz.map((q, i) => (
            <div key={i} className="border p-4 rounded bg-white shadow">
              <div className="font-semibold mb-2">{i + 1}. {q.question}</div>
              {q.options.map((opt, j) => (
                <button key={j} onClick={() => handleAnswer(q, opt)}
                  className="block text-left w-full px-3 py-1 mb-1 border rounded hover:bg-blue-50">
                  {String.fromCharCode(65 + j)}. {opt}
                </button>
              ))}
            </div>
          ))}
          {currentAnswer && (
            <div className="mt-4 p-3 bg-yellow-50 border rounded">
              <div><strong>你的选择：</strong>{currentAnswer.userChoice}</div>
              <div><strong>正确答案：</strong>{currentAnswer.correct}</div>
              <div><strong>解析：</strong>{currentAnswer.explanation}</div>
            </div>
          )}
        </div>
      )}

      <h2 className="mt-8 text-lg font-bold">📘 我的错题本</h2>
      {wrongBook.length === 0 && <p>暂无记录</p>}
      {wrongBook.map((item, index) => (
        <div key={index} className="mt-2 p-3 bg-red-50 border-l-4 border-red-400">
          <strong>题目：</strong>{item.question}<br />
          <strong>你的答案：</strong>{item.userAnswer}<br />
          <strong>正确答案：</strong>{item.correctAnswer}<br />
          <strong>解析：</strong>{item.explanation}<br />
          <strong>记录时间：</strong>{item.date}
        </div>
      ))}
    </main>
  );
}