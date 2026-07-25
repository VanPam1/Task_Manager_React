import dotenv from 'dotenv'
import express, {
  type Request,
  type Response,
  type NextFunction,
} from 'express'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

dotenv.config()

// Variables de entorno
const DATABASE_URL = process.env.DATABASE_URL
const SECRET_KEY = process.env.JWT_SECRET ?? 'mi_clave_secreta'
const PORT = Number(process.env.PORT) || 3000

if (!DATABASE_URL) {
  throw new Error(
    'DATABASE_URL no está configurada. Agrégala en las variables de Railway.',
  )
}

// Prisma 7 con adaptador PostgreSQL
const adapter = new PrismaPg({
  connectionString: DATABASE_URL,
})

const prisma = new PrismaClient({
  adapter,
})

const app = express()

// Middlewares
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
)

app.use(express.json())

// Ruta principal
app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    message: 'Backend Task Manager funcionando correctamente',
  })
})

// Ruta para comprobar el estado del servicio
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    service: 'task-manager-backend',
  })
})

// GET: obtener todas las tareas
app.get('/tasks', async (_req: Request, res: Response) => {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: {
        id: 'asc',
      },
    })

    return res.status(200).json(tasks)
  } catch (error) {
    console.error('Error al obtener tareas:', error)

    return res.status(500).json({
      message: 'Error al obtener tareas',
    })
  }
})

// POST: agregar una tarea
app.post('/tasks', async (req: Request, res: Response) => {
  try {
    const { text } = req.body as { text?: string }

    if (!text || text.trim() === '') {
      return res.status(400).json({
        message: 'El texto de la tarea es obligatorio',
      })
    }

    const newTask = await prisma.task.create({
      data: {
        text: text.trim(),
        completed: false,
      },
    })

    return res.status(201).json(newTask)
  } catch (error) {
    console.error('Error al agregar tarea:', error)

    return res.status(500).json({
      message: 'Error al agregar tarea',
    })
  }
})

// DELETE: eliminar una tarea
app.delete('/tasks/:id', async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id)

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        message: 'ID de tarea inválido',
      })
    }

    const existingTask = await prisma.task.findUnique({
      where: { id },
    })

    if (!existingTask) {
      return res.status(404).json({
        message: 'Tarea no encontrada',
      })
    }

    await prisma.task.delete({
      where: { id },
    })

    return res.status(200).json({
      message: 'Tarea eliminada correctamente',
    })
  } catch (error) {
    console.error('Error al eliminar tarea:', error)

    return res.status(500).json({
      message: 'Error al eliminar tarea',
    })
  }
})

// PUT: cambiar el estado completed
app.put('/tasks/:id', async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id)

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        message: 'ID de tarea inválido',
      })
    }

    const task = await prisma.task.findUnique({
      where: { id },
    })

    if (!task) {
      return res.status(404).json({
        message: 'Tarea no encontrada',
      })
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        completed: !task.completed,
      },
    })

    return res.status(200).json(updatedTask)
  } catch (error) {
    console.error('Error al actualizar tarea:', error)

    return res.status(500).json({
      message: 'Error al actualizar tarea',
    })
  }
})

// PUT: editar el texto de una tarea
app.put('/tasks/edit/:id', async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id)
    const { text } = req.body as { text?: string }

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        message: 'ID de tarea inválido',
      })
    }

    if (!text || text.trim() === '') {
      return res.status(400).json({
        message: 'El texto no puede estar vacío',
      })
    }

    const existingTask = await prisma.task.findUnique({
      where: { id },
    })

    if (!existingTask) {
      return res.status(404).json({
        message: 'Tarea no encontrada',
      })
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        text: text.trim(),
      },
    })

    return res.status(200).json(updatedTask)
  } catch (error) {
    console.error('Error al editar tarea:', error)

    return res.status(500).json({
      message: 'Error al editar tarea',
    })
  }
})

// Login
app.post('/login', (req: Request, res: Response) => {
  const { username, password } = req.body as {
    username?: string
    password?: string
  }

  if (!username || !password) {
    return res.status(400).json({
      message: 'Usuario y contraseña son obligatorios',
    })
  }

  if (username !== 'admin' || password !== '12345') {
    return res.status(401).json({
      message: 'Credenciales inválidas',
    })
  }

  const token = jwt.sign(
    {
      username,
    },
    SECRET_KEY,
    {
      expiresIn: '1h',
    },
  )

  return res.status(200).json({ token })
})

// Tipo para solicitudes autenticadas
interface AuthenticatedRequest extends Request {
  user?: string | jwt.JwtPayload
}

// Middleware para verificar token
const verifyToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({
      message: 'Token requerido',
    })
  }

  const [scheme, token] = authHeader.split(' ')

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({
      message: 'Formato de token inválido',
    })
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY)
    req.user = decoded

    return next()
  } catch {
    return res.status(401).json({
      message: 'Token inválido o expirado',
    })
  }
}

// Ruta privada
app.get(
  '/private',
  verifyToken,
  (req: AuthenticatedRequest, res: Response) => {
    return res.status(200).json({
      message: 'Acceso permitido',
      user: req.user,
    })
  },
)

// Iniciar servidor para Railway
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor iniciado correctamente en el puerto ${PORT}`)
})

// Cierre seguro
const shutdown = async () => {
  console.log('Cerrando servidor...')

  server.close(async () => {
    await prisma.$disconnect()
    console.log('Servidor y Prisma desconectados')
    process.exit(0)
  })
}

process.on('SIGTERM', shutdown)
process.on('SIGINT', shutdown)