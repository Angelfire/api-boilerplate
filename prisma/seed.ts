import { PrismaClient, type Prisma } from "@prisma/client"

import { cleanupDb, createPassword } from "../lib/db-utils"

const prisma = new PrismaClient()

async function seed() {
  console.time("🧹 Cleaned up the database...")
  await cleanupDb(prisma)
  console.timeEnd("🧹 Cleaned up the database...")

  const userData: Prisma.UserCreateInput[] = [
    {
      email: "andres@srhart.co",
      username: "Andreshart",
      password: { create: createPassword("Andreshart") },
    },
    {
      email: "john@srhart.co",
      username: "Johnhart",
      password: { create: createPassword("Johnhart") },
    },
    {
      email: "jane@srhart.co",
      username: "Janehart",
      password: { create: createPassword("Janehart") },
    },
  ]

  console.time(`👤 Created ${userData.length} users...`)
  for (const u of userData) {
    await prisma.user
      .create({
        select: { id: true },
        data: u,
      })
      .catch(e => {
        console.error("Error creating a user:", e)
        return null
      })
  }
  console.timeEnd(`👤 Created ${userData.length} users...`)
}

seed()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async e => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
