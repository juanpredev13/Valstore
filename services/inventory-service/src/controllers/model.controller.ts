import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const getAll = async (_req, res) => {
  const items = await prisma.inventory.findMany()
  res.json(items)
}

export const create = async (req, res) => {
  const data = req.body
  try {
    const item = await prisma.inventory.create({ data })
    res.status(201).json(item)
  } catch (error) {
    res.status(400).json({ error: 'Creation failed' })
  }
}
