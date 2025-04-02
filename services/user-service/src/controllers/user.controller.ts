import { Request, Response } from 'express'
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
