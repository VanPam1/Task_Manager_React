import {Task} from "../App";
import "../styles/TaskCard.css";

type Props = {
  task: Task;
  onDelete: (id: number) => void;
  onToggle: (id: number) => void;
};

function TaskCard({ task, onDelete, onToggle }: Props) {
  return (
    <li className="task-card">
      <span
        className={task.completed ? "completed" : ""}
        onClick={() => onToggle(task.id)}
      >
        {task.completed ? "✅ " : "⬜ "}
        {task.text}
      </span>
      <button className="delete-btn" onClick={() => onDelete(task.id)}>Eliminar</button>
    </li>
  );
}

export default TaskCard;