require("dotenv").config();
const express = require("express");
const cors = require("cors");

//jwt para autenticación
const jwt = require("jsonwebtoken");
const SECRET_KEY="mi_clave_secreta";

//prisma para la base de datos
const { PrismaClient } = require("@prisma/client");
const { PrismaPg}= require("@prisma/adapter-pg");

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});
const app = express();
const PORT = 3000;
//uso de cors para permitir solicitudes desde el frontend
app.use(cors());
// recibir datos en formato JSON
app.use(express.json());
//simulación de una base de datos en memoria
/*let tasks = [
  { id: 1, text: 'Study Express', completed: false },
  { id: 2, text: 'Build backend API', completed: true },
];*/

app.get("/", (req: any, res: any) => {
  res.send("Backend is working!");
});
//GET-Obtener todas las tareas
app.get("/tasks", async (req: any, res: any) => {
  try {
    const tasks = await prisma.task.findMany();
    res.json(tasks);
  } catch (error) {
    console.error("Error al obtener tareas:", error);
    res.status(500).json({ message: "Error al obtener tareas" });
  }
});
//POST-Agregar una nueva tarea
app.post("/tasks", async (req: any, res: any) => {
    console.log("POST /tasks fue llamado");
    console.log("Datos recibidos:", req.body);

    try {
      const newTask = await prisma.task.create({
        data: {
          text: req.body.text,
          completed: false,
        },
      });
      res.status(201).json(newTask);
    } catch (error) {
      console.error("Error al agregar tarea:", error);
      res.status(500).json({ message: "Error al agregar tarea" });
    }
});

//delete-Eliminar una tarea por ID
app.delete("/tasks/:id", async (req: any, res: any) => {
  try {
    const id = Number(req.params.id);
    await prisma.task.delete({
      where: {
        id: id,
      },
    });
    res.json({ message: "Task deleted" });
  } catch (error) {
    console.error("Error al eliminar tarea:", error);
    res.status(500).json({ message: "Error al eliminar tarea" });
  }
});

//put-Actualizar el estado de una tarea por ID
app.put("/tasks/:id", async (req: any, res: any) => {
  
  try {
    const id = Number(req.params.id);
    const task = await prisma.task.findUnique({
      where: {
        id: id,
      },
    });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    //actualizar
    const updatedTask = await prisma.task.update({
      where: {
        id: id,
      },
      data: {
        completed: !task.completed,
      },
    });
    res.json(updatedTask);
  } catch (error) {
    console.error("Error al actualizar tarea:", error);
    res.status(500).json({ message: "Error al actualizar tarea" });
  }

});

//login para autenticación (ejemplo simple sin base de datos)
app.post("/login", (req: any, res: any) => {
  // obtener  username y password
  const { username, password } = req.body;
  // validar credenciales
  if (username !== "admin" || password !== "password") {
    return res.status(401).json({ message: "Credenciales inválidas" });
  }
  //generar token JWT
  const token = jwt.sign(
    { username: username}, 
    SECRET_KEY,
    { expiresIn: "1h" }
  );
  res.json({ token });
});

const verifyToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(403).json({ message: "Token requerido" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Token inválido" });
  }
};

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

app.get("/private", verifyToken, (req: any, res: any)=> {
  res.json({ message: "Acceso permitido" });
});
