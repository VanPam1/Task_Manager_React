import { useEffect, useState } from "react";
import Header from "./componentes/Header";
import TaskInput from "./componentes/TaskInput";
import TaskList from "./componentes/TaskList";
import EmptyState from "./componentes/EmptyState";
import Footer from "./componentes/Footer";
import Login from "./componentes/Login";

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

  // FUNCIÓN CENTRAL
  const fetchTasks = async () => {
    try {
      const res = await fetch("http://localhost:3000/tasks");
      const data = await res.json();
      setTasks(data);
    } catch (error) {
      console.error("Error al obtener tareas:", error);
    }
  };

  //cargar tareas después del login
  useEffect(() => {
    if (token) {
      fetchTasks();
    }
  }, [token]);

  // POST
  const addTask = async (task: string) => {
    if (!task.trim()) {
      alert("La tarea no puede estar vacía");
      return;
    }

    await fetch("http://localhost:3000/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: task }),
    });

    fetchTasks();
  };
  // PUT para editar texto de tarea
  const editTask = async (id: number, newText: string) => {
  if (!newText.trim()) {
    alert("No puede estar vacío");
    return;
  }

  await fetch(`http://localhost:3000/tasks/edit/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text: newText }),
  });

  fetchTasks();
};

  // ✅ DELETE
  const deleteTask = async (id: number) => {
    await fetch(`http://localhost:3000/tasks/${id}`, {
      method: "DELETE",
    });

    fetchTasks();
  };

  // ✅ PUT
  const toggleTask = async (id: number) => {
    await fetch(`http://localhost:3000/tasks/${id}`, {
      method: "PUT",
    });

    fetchTasks();
  };

  // 🔥 logout
  const logout = () => {
    localStorage.removeItem("token");
    setTasks([]);
    setToken(null);
  };

  // 🔐 probar ruta privada
  const testPrivate = async () => {
    const res = await fetch("http://localhost:3000/private", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    alert(data.message);
  };

  // 🔎 FILTROS
  const filteredTasks = tasks.filter((task) => {
    if (filter === "pendiente") return !task.completed;
    if (filter === "completado") return task.completed;
    return true;
  });

  return (
    <div className="app">
      {!token ? (
        <Login onLogin={setToken} />
      ) : (
        <div className="container">
          <Header />  

          <TaskInput onAdd={addTask} />

          <div className="filters">
            <button onClick={() => setFilter("todos")}>Todos</button>
            <button onClick={() => setFilter("pendiente")}>
              Pendiente
            </button>
            <button onClick={() => setFilter("completado")}>
              Completado
            </button>
          </div>

          {filteredTasks.length === 0 ? (
            <EmptyState />
          ) : (
            <TaskList
              tasks={filteredTasks}
              onDelete={deleteTask}
              onToggle={toggleTask}
              onEdit={editTask}
            />
          )}

          <Footer total={tasks.length} />
          <button onClick={logout}>Cerrar sesión</button>
        </div>
      )}
    </div>
  );
}

export default App;