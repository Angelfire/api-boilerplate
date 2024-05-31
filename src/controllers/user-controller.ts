import { Prisma } from "@prisma/client"
import bcrypt from "bcryptjs"
import type { Request, Response } from "express"

import { prisma } from "../lib/db.server"

export const getAllUsers = async (_req: Request, res: Response) => {
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

export const getUserByIdentifier = async (req: Request, res: Response) => {
  const { identifier } = req.params

  try {
    let user: Prisma.UserCreateInput | null

    // Regex to check if the identifier is a valid CUUID
    if (typeof identifier === "string" && /^c[^\s-]{24,}$/.test(identifier)) {
      user = await prisma.user.findUnique({
        where: { id: identifier },
      })
    } else if (typeof identifier === "string") {
      user = await prisma.user.findUnique({
        where: { username: identifier },
      })
    } else {
      return res.status(400).json({ error: "Invalid identifier" })
    }

    if (user) {
      res.json(user)
    } else {
      res.status(404).json({ error: "User not found" })
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" })
  }
}

export const getUserByUsername = async (req: Request, res: Response) => {
  try {
    const { username } = req.params

    const user = await prisma.user.findUnique({
      where: {
        username,
      },
      select: {
        id: true,
        username: true,
        email: true,
      },
    })

    if (!user) {
      return res.status(404).json({ error: "User not found." })
    }

    res.json(user)
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

export const deleteUserByIdentifier = async (req: Request, res: Response) => {
  const { identifier } = req.params

  try {
    let user: Prisma.UserCreateInput | null

    // Regex to check if the identifier is a valid CUID
    if (typeof identifier === "string" && /^c[^\s-]{24,}$/.test(identifier)) {
      user = await prisma.user.findUnique({
        where: { id: identifier },
      })
    } else if (typeof identifier === "string") {
      user = await prisma.user.findUnique({
        where: { username: identifier },
      })
    } else {
      return res.status(400).json({ error: "Invalid identifier" })
    }

    if (user) {
      await prisma.user.delete({
        where: { id: user.id },
      })
      res.json({ message: "User deleted successfully" })
    } else {
      res.status(404).json({ error: "User not found" })
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" })
  }
}
