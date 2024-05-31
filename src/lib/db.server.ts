import { PrismaClient, type Prisma } from "@prisma/client"

const log: Prisma.LogDefinition[] = [
  {
    level: "error",
    emit: "stdout",
  },
  {
    level: "info",
    emit: "stdout",
  },
  {
    level: "warn",
    emit: "stdout",
  },
  {
    level: "query",
    emit: "event",
  },
]

export const prisma = new PrismaClient({
  log,
})

// Listen log events for queries
// prisma.$on("query", e => {
//   console.log(`Query: ${e.query}`)
//   console.log(`Params: ${e.params}`)
//   console.log(`Duration: ${e.duration}ms`)
// })
