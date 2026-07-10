#  Task Manager React

Aplicación web para la gestión de tareas desarrollada con **React + Vite** en el frontend y **Node.js + Express + Prisma** en el backend. Permite administrar tareas de forma sencilla mediante una interfaz moderna y una API conectada a una base de datos PostgreSQL.

<!-- BADGE_CI -->

---

# Instalación local

## 1. Clonar el repositorio

```bash
git clone https://github.com/TU-USUARIO/TU-REPOSITORIO.git
cd Task_Manager_React
```

> Reemplaza la URL anterior por la de tu repositorio en GitHub.

## 2. Instalar dependencias del Frontend

```bash
npm install
```

## 3. Instalar dependencias del Backend

```bash
cd backend
npm install
cd ..
```

---

# Variables de entorno

Crear un archivo `.env` dentro de la carpeta **backend** con las siguientes variables (sin colocar valores reales):

```env
DATABASE_URL=
JWT_SECRET=
PORT=
```

---

# Ejecución del proyecto

### Frontend

```bash
npm run dev
```

### Backend

```bash
cd backend
npm run dev
```

---

# Comandos disponibles

| Comando                     | Descripción                                |
| --------------------------- | ------------------------------------------ |
| `npm install`               | Instala las dependencias del frontend      |
| `npm run dev`               | Ejecuta el frontend en modo desarrollo     |
| `npm run build`             | Genera el build de producción del frontend |
| `npm test`                  | Pendiente — Se implementará en la Sesión 3 |
| `cd backend && npm install` | Instala las dependencias del backend       |
| `cd backend && npm run dev` | Ejecuta el servidor backend                |

---

# Base de datos

El proyecto utiliza **PostgreSQL** como sistema gestor de base de datos.

El acceso a la base de datos se realiza mediante **Prisma ORM**, encargado de administrar el esquema, las migraciones y la comunicación con PostgreSQL.

---

#  Tecnologías utilizadas

* React
* Vite
* Node.js
* Express
* Prisma ORM
* PostgreSQL
* TypeScript
* JavaScript
* CSS

---

# Estructura del proyecto

```
Task_Manager_React
│
├── backend/
│   ├── prisma/
│   ├── src/
│   ├── package.json
│
├── public/
├── src/
├── package.json
├── vite.config.js
└── README.md
```

---

# Autora

**Vania Patzi**

Proyecto desarrollado para el Diplomado – Módulo 4: Integración y Despliegue Continuo.
