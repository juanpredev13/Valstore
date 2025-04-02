const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Get service name from CLI
const name = process.argv[2];
if (!name) {
  console.error('❌ You must specify a microservice name.');
  console.error('Example: node init-microservice.js product-service');
  process.exit(1);
}

// Extract model name (remove "-service" and PascalCase it)
const baseName = name.replace(/-service$/, '');
const modelName = baseName.charAt(0).toUpperCase() + baseName.slice(1).replace(/-([a-z])/g, (_, l) => l.toUpperCase());

const base = path.join('services', name);

// Folder structure
const folders = [
  'src',
  'src/controllers',
  'src/routes',
  'src/services',
  'src/middlewares',
  'src/utils',
  'prisma',
];

// TypeScript config
const tsconfig = `{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
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

// package.json with ESM + tsx + pkgroll
const pkg = `{
  "name": "${name}",
  "version": "1.0.0",
  "main": "index.js",
  "type": "module",
  "exports": {
    ".": "./dist/index.mjs"
  },
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "start": "node dist/index.mjs",
    "build": "pkgroll",
    "test": "echo \\"Error: no test specified\\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "description": "",
  "devDependencies": {
    "@types/express": "^5.0.0",
    "@types/node": "^22.13.5",
    "tsx": "^4.19.3",
    "typescript": "^5.7.3"
  },
  "dependencies": {
    "express": "^4.21.2",
    "pkgroll": "^2.11.2"
  }
}
`;

const env = `DATABASE_URL="mongodb+srv://user:pass@cluster.mongodb.net/${name}?retryWrites=true&w=majority"
PORT=4000
`;

const gitignore = `node_modules
dist
.env
`;

// Entry point (index.ts)
const indexTs = `import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import ${baseName}Routes from './routes/model.routes.js'

dotenv.config()
const app = express()
const PORT = process.env.PORT || 4000

app.use(cors())
app.use(express.json())
app.use('/api/${baseName}', ${baseName}Routes)

app.listen(PORT, () => {
  console.log('${name} running on port ' + PORT)
})
`;

// Generic route file
const modelRoutes = `import { Router } from 'express'
import { getAll, create } from '../controllers/model.controller.js'

const router = Router()

router.get('/', getAll)
router.post('/', create)

export default router
`;

// Generic controller
const modelController = `import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const getAll = async (_req, res) => {
  const items = await prisma.${baseName}.findMany()
  res.json(items)
}

export const create = async (req, res) => {
  const data = req.body
  try {
    const item = await prisma.${baseName}.create({ data })
    res.status(201).json(item)
  } catch (error) {
    res.status(400).json({ error: 'Creation failed' })
  }
}
`;

// Editable model config
const modelConfig = `export const model = {
  name: '${modelName}',
  fields: [
    { name: 'name', type: 'String', required: true },
    { name: 'description', type: 'String' },
    { name: 'active', type: 'Boolean', default: true }
  ]
}
`;

// Create folders
folders.forEach(folder => {
  fs.mkdirSync(path.join(base, folder), { recursive: true });
});

// Create files
fs.writeFileSync(path.join(base, 'tsconfig.json'), tsconfig);
fs.writeFileSync(path.join(base, 'package.json'), pkg);
fs.writeFileSync(path.join(base, '.env'), env);
fs.writeFileSync(path.join(base, '.gitignore'), gitignore);
fs.writeFileSync(path.join(base, 'src/index.ts'), indexTs);
fs.writeFileSync(path.join(base, 'src/routes/model.routes.ts'), modelRoutes);
fs.writeFileSync(path.join(base, 'src/controllers/model.controller.ts'), modelController);
fs.writeFileSync(path.join(base, 'prisma/model.config.ts'), modelConfig);

// Install dependencies
console.log(`\n📦 Installing dependencies in ${base}...`);
execSync(`cd ${base} && npm install`, { stdio: 'inherit' });
execSync(`cd ${base} && npm install -D`, { stdio: 'inherit' });

console.log(`\n✅ Microservice '${name}' with model '${modelName}' created in ./services/${name}`);
