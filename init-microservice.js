const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const name = process.argv[2];

if (!name) {
  console.error('❌ Debes especificar un nombre para el microservicio.');
  console.error('Ejemplo: node init-microservice.js user-service');
  process.exit(1);
}

const base = path.join('services', name);

const folders = [
  'src',
  'src/controllers',
  'src/routes',
  'src/services',
  'src/middlewares',
  'src/utils',
  'prisma',
];

const tsconfig = `{
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS",
    "moduleResolution": "Node",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "outDir": "dist",
    "rootDir": "src",
    "types": ["node"]
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
`;

const env = `DATABASE_URL="mongodb+srv://user:pass@cluster.mongodb.net/${name}?retryWrites=true&w=majority"
PORT=4000
`;

const gitignore = `node_modules
dist
.env
`;

const indexTs = `import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import userRoutes from './routes/user.routes'

dotenv.config()
const app = express()
const PORT = process.env.PORT || 4000

app.use(cors())
app.use(express.json())
app.use('/api/users', userRoutes)

app.listen(PORT, () => {
  console.log(\`${name} running on port \${PORT}\`)
})
`;

const userRoutes = `import { Router } from 'express'
import { getAllUsers, createUser } from '../controllers/user.controller'

const router = Router()

router.get('/', getAllUsers)
router.post('/', createUser)

export default router
`;

const userController = `import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const getAllUsers = async (_req: Request, res: Response) => {
  const users = await prisma.user.findMany()
  res.json(users)
}

export const createUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body
  try {
    const user = await prisma.user.create({
      data: { name, email, password }
    })
    res.status(201).json(user)
  } catch (error) {
    res.status(400).json({ error: 'Email already exists' })
  }
}
`;

const prismaSchema = `generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(auto()) @map("_id") @test.ObjectId
  name      String
  email     String   @unique
  password  String
  role      String   @default("user")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
`;

// Crear carpetas
folders.forEach(folder => {
  fs.mkdirSync(path.join(base, folder), { recursive: true });
});

// Crear archivos base
fs.writeFileSync(path.join(base, 'tsconfig.json'), tsconfig);
fs.writeFileSync(path.join(base, '.env'), env);
fs.writeFileSync(path.join(base, '.gitignore'), gitignore);
fs.writeFileSync(path.join(base, 'src/index.ts'), indexTs);
fs.writeFileSync(path.join(base, 'src/routes/user.routes.ts'), userRoutes);
fs.writeFileSync(path.join(base, 'src/controllers/user.controller.ts'), userController);
fs.writeFileSync(path.join(base, 'prisma/schema.prisma'), prismaSchema);

// Inicializar npm y dependencias
console.log(`\n📦 Inicializando npm y Prisma en ${base}...`);
execSync(`cd ${base} && npm init -y`, { stdio: 'inherit' });
execSync(`cd ${base} && npm install express cors dotenv @prisma/client`, { stdio: 'inherit' });
execSync(`cd ${base} && npm install -D prisma typescript ts-node-dev @types/node @types/express`, { stdio: 'inherit' });

console.log(`\n✅ Microservicio '${name}' creado en ./services/${name}`);
