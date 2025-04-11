# User Microservice

## 📦 Tech Stack
- Bun + Express
- MongoDB (Docker)
- TypeScript (ESM, strict mode)

## ▶️ Run with Docker

```bash
docker compose up --build
```

Or with hot reload:

```bash
docker compose -f docker-compose.yml -f docker-compose.override.yml up
```

## 🔁 File Watch Support
- Code is mounted and reloaded with Bun using `--watch`
- See `docker-compose.override.yml`

## 📂 Project Structure

```
services/user/
├── controllers/
├── services/
├── repositories/
├── routes/
├── models/
├── dtos/
├── types/
├── di/
├── src/
├── .env
├── Dockerfile
├── tsconfig.json
└── README.md
```

## 📮 Endpoints
- `GET /user` (basic route stub)
- `GET /health` for service health check

## 🧠 Notes
- MongoDB is accessible via: `MONGO_URI=mongodb://mongo-user:27017/userdb`
- TSConfig is set for ESM with `verbatimModuleSyntax` for modern imports.