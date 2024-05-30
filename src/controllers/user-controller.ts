import { Prisma, PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"
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
export const createUser = async (req: Request, res: Response) => {
  try {
    const { email, username, password } = req.body

    if (!email || !username || !password) {
      return res.status(400).json({ error: "All fields are required." })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = bcrypt.hashSync(password, salt)

    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: {
          create: {
            hash: hashedPassword,
          },
        },
      },
    })

    res.status(201).json(user)
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      // P2002 is the error code for unique constraint violation in Prisma Client
      error.code === "P2002"
    ) {
      res.status(400).json({ error: "Email or username already exists." })
    } else {
      res.status(500).json({ error: "Internal Server Error" })
    }
  }
}
