import type { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

export function createPassword(password: string) {
  return {
    hash: bcrypt.hashSync(password, 12),
  }
}

export async function cleanupDb(prisma: PrismaClient) {
  const tables = await prisma.$queryRaw<
    { tablename: string }[]
  >`SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename NOT LIKE '_prisma_migrations'`

  await prisma.$transaction([
    // Disable FK constraints to avoid relation conflicts during deletion
    prisma.$executeRawUnsafe(`SET session_replication_role = 'replica';`),
    // Delete all rows from each table, preserving table structures
    ...tables.map(({ tablename }) =>
      prisma.$executeRawUnsafe(`TRUNCATE TABLE "${tablename}" CASCADE;`),
    ),
    // Enable FK constraints
    prisma.$executeRawUnsafe(`SET session_replication_role = 'origin';`),
  ])
}
