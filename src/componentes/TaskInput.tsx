import { useState } from "react";
import "../styles/TaskInput.css";


type Props = {
  onAdd: (task: string) => void;
};

function TaskInput({ onAdd }: Props) {
  const [value, setValue] = useState("");
  const [showError, setShowError] = useState(false);

  const handleAdd = () => {
    if (!value.trim()) {
      setShowError(true);

      setTimeout(() => {
        setShowError(false);
      }, 2000);
      return;
    }
    onAdd(value);
    setValue("");
  };

  return (
    <div className="input-group">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Escribe una nueva tarea"
      />
      <button onClick={handleAdd}>Agregar</button>
        {showError && 
        <div className="error">La tarea no puede estar vacía</div>}
    </div>
  );
}

export default TaskInput;