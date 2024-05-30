import { PrismaClient } from "@prisma/client"
import type { Request, Response } from "express"

const prisma = new PrismaClient()

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
      },
    })

    const totalUsers = await prisma.user.count()

    res.json({
      users,
      total: totalUsers,
    })
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" })
  }
}
