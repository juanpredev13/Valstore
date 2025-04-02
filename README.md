# Valstore
Inventory made legendary.

Valstore is a next-generation inventory management platform inspired by the legendary halls of Valhalla. Built for modern businesses, it brings powerful tools, real-time tracking, and smart automation to help you keep your stock under control — effortlessly.

Take command of your inventory like a Norse god.
# 🧩 Microservices Starter with Node.js, TypeScript and Prisma

This project is a scalable monorepo structure for microservices built with:

- Node.js + Express
- TypeScript
- Prisma ORM
- MongoDB
- TSConfig inspired by [Bluuweb's Node TypeScript setup](https://bluuweb.dev/node-ts/tsx.html)

Each service lives inside the `services/` directory and is completely independent.

---

## 📁 Folder Structure

```
microservices/
├── services/
│   ├── user-service/
│   │   ├── src/
│   │   ├── prisma/
│   │   ├── .env
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── ...
├── init-microservice.js
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v16+
- npm
- MongoDB (local or Atlas)

---

## ⚙️ How to Generate a Microservice

You can use the `init-microservice.js` script to bootstrap a fully working microservice in seconds.

### 📦 Step-by-step

1. Clone this repo or create a project folder:

```bash
mkdir microservices && cd microservices
```

2. Add the `init-microservice.js` script (you can copy from this repo).

3. Run the script with the name of the microservice:

```bash
node init-microservice.js user-service
```

This will generate:

- `services/user-service/` with:
  - Express + TypeScript boilerplate
  - Prisma setup with MongoDB
  - Sample routes and controllers
  - `.env`, `tsconfig.json`, `.gitignore`

4. Navigate to the service and run it:

```bash
cd services/user-service
npx prisma generate
npm run dev
```

---

## 🧪 Scripts Available

Each microservice comes with:

```json
"scripts": {
  "dev": "ts-node-dev --respawn src/index.ts",
  "build": "tsc",
  "start": "node dist/index.js"
}
```

---

## 🐳 Docker Support (optional)

You can add a `docker-compose.yml` to run MongoDB locally and connect each service.

Coming soon...

---

## 🛠️ Want to Add More Services?

Just run the generator again:

```bash
node init-microservice.js product-service
```

---

## 📬 Contact

If you want to collaborate or improve this setup, feel free to fork or open an issue.

Made with ❤️ by [juanpre.dev](juanpre.dev)
