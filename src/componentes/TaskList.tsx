import TaskCard from "./TaskCard";
import { Task } from "../App";

type Props = {
  tasks: Task[];
  onDelete: (id: number) => void;
  onToggle: (id: number) => void;
};

function TaskList({ tasks, onDelete, onToggle }: Props) {
  return (
    <ul>
      {tasks.map(task => (
        <TaskCard 
          key={task.id} 
          task={task}
          onDelete={() => onDelete(task.id)}
          onToggle={() => onToggle(task.id)}
        />
      ))}
    </ul>
  );
}

export default TaskList;