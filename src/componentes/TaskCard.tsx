import { useState } from "react";
import { Task } from "../App";
import "../styles/TaskCard.css";

type Props = {
  task: Task;
  onDelete: (id: number) => void;
  onToggle: (id: number) => void;
  onEdit: (id: number, newText: string) => void;
};

function TaskCard({ task, onDelete, onToggle, onEdit }: Props) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(task.text);

  const handleEdit = () => {
    if (!text.trim()) {
      alert("No puede estar vacío");
      return;
    }

    onEdit(task.id, text);
    setEditing(false);
  };

  return (
    <li className="task-card">
      {editing ? (
        <>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button onClick={handleEdit}>Guardar</button>
          <button onClick={() => setEditing(false)}>Cancelar</button>
        </>
      ) : (
        <>
          <span
            className={task.completed ? "completed" : ""}
            onClick={() => onToggle(task.id)}
          >
            {task.completed ? "✅ " : "⬜ "}
            {task.text}
          </span>
          <div className="actions">
            {/* BOTÓN EDITAR */}
            <button className="edit-btn" onClick={() => setEditing(true)}>
              Editar
            </button>

            <button
              className="delete-btn"
              onClick={() => onDelete(task.id)}>
              Eliminar
            </button>
          </div>
          
        </>
      )}
    </li>
  );
}

export default TaskCard;