import fs from 'fs';
import path, { dirname } from 'path';
import { execSync } from 'child_process';
import prompts from 'prompts';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const toPascalCase = (str: string): string =>
  str.replace(/(^\w|-\w)/g, c => c.replace('-', '').toUpperCase());

const toKebabCase = (str: string): string =>
  str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();

const toLower = (str: string): string => str.toLowerCase();

const promptUser = async (): Promise<string> => {
  const { modelName } = await prompts({
    type: 'text',
    name: 'modelName',
    message: 'Enter the model name (e.g., User, Product):',
    validate: val => val.length ? true : 'Required',
  });
  return modelName;
};

const createFile = (dir: string, fileName: string, content: string) => {
  const fullPath = path.join(dir, fileName);
  fs.writeFileSync(fullPath, content);
};

const generateService = async () => {
  const modelName = await promptUser();

  const pascal = toPascalCase(modelName);
  const kebab = toKebabCase(modelName);
  const lower = toLower(modelName);

  const base = path.join(__dirname, 'services', kebab);
  const folders = ['controllers', 'services', 'repositories', 'routes', 'models', 'types', 'di', 'dtos', 'src'];

  folders.forEach(folder => {
    fs.mkdirSync(path.join(base, folder), { recursive: true });
  });

  createFile(path.join(base, 'controllers'), `${pascal}.controller.ts`,
    `import { Request, Response } from 'express';\n\nexport class ${pascal}Controller {\n  constructor(private service: ${pascal}Service) {}\n\n  getAll(req: Request, res: Response) {\n    res.json([]);\n  }\n}`);

  createFile(path.join(base, 'services'), `${pascal}.service.ts`,
    `import type { Create${pascal}Dto } from '../dtos/create-${lower}.dto';\nimport type { Update${pascal}Dto } from '../dtos/update-${lower}.dto';\nimport type { ${pascal} } from '../models/${pascal}.model';\n\nexport class ${pascal}Service {\n  constructor(private repository: ${pascal}Repository) {}\n}`);

  createFile(path.join(base, 'repositories'), `${pascal}.repository.ts`,
    `export class ${pascal}Repository {\n  async findAll() {\n    return [];\n  }\n}`);

  createFile(path.join(base, 'routes'), `${lower}.routes.ts`,
    `import { Router } from 'express';\nimport { ${lower}Controller } from '../di/${lower}.di';\n\nconst router = Router();\n\nrouter.get('/', (req, res) => ${lower}Controller.getAll(req, res));\n\nexport default router;`);

  createFile(path.join(base, 'models'), `${pascal}.model.ts`,
    `export interface ${pascal} {\n  id: string;\n}`);

  createFile(path.join(base, 'dtos'), `create-${lower}.dto.ts`,
    `export interface Create${pascal}Dto {\n  // define fields\n}`);

  createFile(path.join(base, 'dtos'), `update-${lower}.dto.ts`,
    `export interface Update${pascal}Dto {\n  // define fields\n}`);

  createFile(path.join(base, 'di'), `${lower}.di.ts`,
    `import { ${pascal}Repository } from '../repositories/${pascal}.repository';\nimport { ${pascal}Service } from '../services/${pascal}.service';\nimport { ${pascal}Controller } from '../controllers/${pascal}.controller';\n\nconst ${lower}Repository = new ${pascal}Repository();\nconst ${lower}Service = new ${pascal}Service(${lower}Repository);\nexport const ${lower}Controller = new ${pascal}Controller(${lower}Service);`);

  createFile(base, 'Dockerfile',
    `FROM oven/bun:1\n\nWORKDIR /app\nCOPY . .\nRUN bun install\nCMD [\"bun\", \"--watch\", \"src/index.ts\"]`);

  createFile(base, '.env',
    `MONGO_URI=mongodb://mongo-${lower}:27017/${lower}db`);

  createFile(path.join(base, 'src'), 'index.ts',
    `import express from 'express';\nimport { MongoClient } from \"mongodb\";\n\nconst app = express();\napp.use(express.json());\n\napp.get('/health', (req, res) => {\n  res.status(200).json({ status: 'ok' });\n});\n\nconst uri = process.env.MONGO_URI || \"mongodb://localhost:27017/${lower}db\";\nconst client = new MongoClient(uri);\n\nasync function run() {\n  try {\n    await client.connect();\n    console.log(\"✅ Connected to MongoDB\");\n    app.listen(3000, () => console.log(\"🚀 Server ready on http://localhost:3000\"));\n  } catch (err) {\n    console.error(\"❌ MongoDB error:\", err);\n  }\n}\n\nrun();`);

  createFile(base, 'tsconfig.json', JSON.stringify({
    compilerOptions: {
      target: "ES2022",
      module: "ES2022",
      moduleResolution: "node",
      verbatimModuleSyntax: true,
      lib: ["ESNext"],
      strict: true,
      skipLibCheck: true,
      esModuleInterop: true,
      forceConsistentCasingInFileNames: true,
      noEmit: true,
      resolveJsonModule: true,
      outDir: "./dist",
      rootDir: "./",
      types: ["node"]
    },
    include: [
      "src", "routes", "controllers", "services", "repositories", "models", "types", "di", "dtos"
    ],
    exclude: ["dist", "node_modules"]
  }, null, 2));

  createFile(base, 'README.md', `# ${pascal} Microservice\n\n## 📦 Tech Stack\n- Bun + Express\n- MongoDB (Docker)\n- TypeScript (ESM, strict mode)\n\n## ▶️ Run with Docker\n\n\`\`\`bash\ndocker compose up --build\n\`\`\`\n\nOr with hot reload:\n\n\`\`\`bash\ndocker compose -f docker-compose.yml -f docker-compose.override.yml up\n\`\`\`\n\n## 🔁 File Watch Support\n- Code is mounted and reloaded with Bun using \`--watch\`\n- See \`docker-compose.override.yml\`\n\n## 📂 Project Structure\n\n\`\`\`\nservices/${kebab}/\n├── controllers/\n├── services/\n├── repositories/\n├── routes/\n├── models/\n├── dtos/\n├── types/\n├── di/\n├── src/\n├── .env\n├── Dockerfile\n├── tsconfig.json\n└── README.md\n\`\`\`\n\n## 📮 Endpoints\n- \`GET /${lower}\` (basic route stub)\n- \`GET /health\` for service health check\n\n## 🧠 Notes\n- MongoDB is accessible via: \`MONGO_URI=mongodb://mongo-${lower}:27017/${lower}db\`\n- TSConfig is set for ESM with \`verbatimModuleSyntax\` for modern imports.`);

  console.log(`📦 Initializing ${kebab} service with Bun...`);
  execSync(`cd ${base} && bun init -y`, { stdio: 'inherit' });
  execSync(`cd ${base} && bun add express mongodb`, { stdio: 'inherit' });
  execSync(`cd ${base} && bun add -d @types/express @types/node`, { stdio: 'inherit' });

  console.log(`\n✅ Microservice \"${modelName}\" ready!`);
};

generateService();
