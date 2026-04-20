import { useEffect, useState } from "react";
import Header from "./componentes/Header";
import TaskInput from "./componentes/TaskInput";
import TaskList from "./componentes/TaskList";
import EmptyState from "./componentes/EmptyState";
import Footer from "./componentes/Footer";
import Login from "./componentes/login";

export type Task = {
  id: number;
  text: string;
  completed: boolean;
};

type Filter = "todos" | "pendiente" | "completado";

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<Filter>("todos");

  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  if (!token) {
    return <Login onLogin={setToken} />;
  }
  

  // 🔥 FUNCIÓN CENTRAL (IMPORTANTE)
  const fetchTasks = async () => {
    try {
      const res = await fetch("http://localhost:3000/tasks");
      const data = await res.json();
      setTasks(data);
    } catch (error) {
      console.error("Error al obtener tareas:", error);
    }
  };

  // ✅ Cargar tareas al iniciar
  useEffect(() => {
    fetchTasks();
  }, []);

  // ✅ POST
  const addTask = async (task: string) => {
    if (!task.trim()) {
      alert("La tarea no puede estar vacía");
      return;
    }

    try {
      await fetch("http://localhost:3000/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: task }),
      });

      fetchTasks(); // 🔥 sincronizar
    } catch (error) {
      console.error("Error al agregar tarea:", error);
    }
  };

  // ✅ DELETE (AHORA CON BACKEND)
  const deleteTask = async (id: number) => {
    try {
      await fetch(`http://localhost:3000/tasks/${id}`, {
        method: "DELETE",
      });

      fetchTasks(); // 🔥 sincronizar
    } catch (error) {
      console.error("Error al eliminar tarea:", error);
    }
  };

  // ✅ PUT (TOGGLE COMPLETED)
  const toggleTask = async (id: number) => {
    try {
      await fetch(`http://localhost:3000/tasks/${id}`, {
        method: "PUT",
      });

      fetchTasks(); // 🔥 sincronizar
    } catch (error) {
      console.error("Error al actualizar tarea:", error);
    }
  };

  // 🔎 FILTROS
  const filteredTasks = tasks.filter((task) => {
    if (filter === "pendiente") return !task.completed;
    if (filter === "completado") return task.completed;
    return true;
  });

  return (
    <div className="app">
      <div className="container">
        <Header />

        <TaskInput onAdd={addTask} />

        <div className="filters">
          <button onClick={() => setFilter("todos")}>Todos</button>
          <button onClick={() => setFilter("pendiente")}>Pendiente</button>
          <button onClick={() => setFilter("completado")}>Completado</button>
        </div>

        {filteredTasks.length === 0 ? (
          <EmptyState />
        ) : (
          <TaskList
            tasks={filteredTasks}
            onDelete={deleteTask}
            onToggle={toggleTask}
          />
        )}

        <Footer total={tasks.length} />
      </div>
    </div>
  );
}

export default App;