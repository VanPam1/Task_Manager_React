import TaskCard from "./TaskCard";
import { Task } from "../App";

type Props = {
  tasks: Task[];
  onDelete: (id: number) => void;
  onToggle: (id: number) => void;
  onEdit: (id: number, text: string) => void;
};

function TaskList({ tasks, onDelete, onToggle, onEdit }: Props) {
  return (
    <ul>
      {tasks.map(task => (
        <TaskCard 
          key={task.id} 
          task={task}
          onDelete={onDelete}
          onToggle={onToggle}
          onEdit={onEdit}
        />
      ))}
    </ul>
  );
}

export default TaskList;