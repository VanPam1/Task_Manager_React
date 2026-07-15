import { useState } from "react";

export default function TestPage() {
  const [tasks, setTasks] = useState<string[]>([]);
  const [text, setText] = useState("");

  const addTask = () => {
    if (!text.trim()) return;

    setTasks([...tasks, text]);
    setText("");
  };

  return (
    <div>
      <h1>Playwright Test</h1>

      <input
        placeholder="Nueva tarea"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button onClick={addTask}>
        Agregar
      </button>

      <ul>
        {tasks.map((t, i) => (
          <li key={i}>{t}</li>
        ))}
      </ul>
    </div>
  );
}