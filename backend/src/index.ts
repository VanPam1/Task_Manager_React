import dotenv from 'dotenv'
import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

dotenv.config()

const SECRET_KEY:string = process.env.JWT_SECRET ?? 'mi_clave_secreta'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})

const prisma = new PrismaClient({
  adapter,
})

const app = express()
const PORT = process.env.PORT || 3000

// uso de cors para permitir solicitudes desde el frontend
app.use(cors())
// recibir datos en formato JSON
app.use(express.json())

app.get('/', (_req: Request, res: Response) => {
  res.send('Backend is working!')
})

app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' })
})

// GET - Obtener todas las tareas
app.get('/tasks', async (_req: Request, res: Response) => {
  try {
    const tasks = await prisma.task.findMany()
    res.json(tasks)
  } catch (_error) {
    console.error('Error al obtener tareas:', _error)
    res.status(500).json({ message: 'Error al obtener tareas' })
  }
})

// POST - Agregar una nueva tarea
app.post('/tasks', async (req: Request, res: Response) => {
  console.log('POST /tasks fue llamado')
  console.log('Datos recibidos:', req.body)

  try {
    const newTask = await prisma.task.create({
      data: {
        text: req.body.text,
        completed: false,
      },
    })
    res.status(201).json(newTask)
  } catch (_error) {
    console.error('Error al agregar tarea:', _error)
    res.status(500).json({ message: 'Error al agregar tarea' })
  }
})

// DELETE - Eliminar una tarea por ID
app.delete('/tasks/:id', async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id)
    await prisma.task.delete({
      where: {
        id: id,
      },
    })
    res.json({ message: 'Task deleted' })
  } catch (_error) {
    console.error('Error al eliminar tarea:', _error)
    res.status(500).json({ message: 'Error al eliminar tarea' })
  }
})

// PUT - Actualizar el estado de una tarea por ID
app.put('/tasks/:id', async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id)
    const task = await prisma.task.findUnique({
      where: {
        id: id,
      },
    })
    if (!task) {
      return res.status(404).json({ message: 'Task not found' })
    }
    // actualizar
    const updatedTask = await prisma.task.update({
      where: {
        id: id,
      },
      data: {
        completed: !task.completed,
      },
    })
    return res.json(updatedTask)
  } catch (_error) {
    console.error('Error al actualizar tarea:', _error)
    return res.status(500).json({ message: 'Error al actualizar tarea' })
  }
})

// EDITAR TEXTO DE TAREA
app.put('/tasks/edit/:id', async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id)
    const { text } = req.body

    if (!text || text.trim() === '') {
      return res.status(400).json({ message: 'Texto vacío' })
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: { text },
    })

    return res.json(updatedTask)
  } catch (_error) {
    console.error('Error al editar tarea:', _error)
    return res.status(500).json({ message: 'Error al editar tarea' })
  }
})

// Login para autenticación
app.post('/login', (req: Request, res: Response) => {
  const { username, password } = req.body
  if (username !== 'admin' || password !== '12345') {
    return res.status(401).json({ message: 'Credenciales inválidas' })
  }
  const token = jwt.sign({ username: username }, SECRET_KEY, { expiresIn: '1h' })
  return res.json({ token })
})

// Middleware para verificar token
interface AuthenticatedRequest extends Request {
  user?: string | jwt.JwtPayload
}

const verifyToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization']
  if (!authHeader) {
    return res.status(403).json({ message: 'Token requerido' })
  }
  const [scheme, token] = authHeader.split(' ')
  if (scheme !== 'Bearer'|| !token) {
    return res.status(403).json({ message: 'Formato de token inválido' })
  }
  try {
    const decoded = jwt.verify(token, SECRET_KEY)
    req.user = decoded
    return next()
  } catch {
    return res.status(403).json({ message: "Token inválido" })
  }
}

app.get('/private', verifyToken, (_req: AuthenticatedRequest, res: Response) => {
  res.json({ message: 'Acceso permitido' })
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})