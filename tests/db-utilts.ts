import type { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

export const generateRandomString = (length: number) => {
	const characters = 'abcdefghijklmnopqrstuvwxyz0123456789'

	let result = ''

	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * characters.length))
	}

	return result
}

export function createPassword(password: string) {
	return {
		hash: bcrypt.hashSync(password, 12)
	}
}

export const getRandomInt = (min: number, max: number) => {
	const roundedMin = Math.ceil(min)
	const roundedMax = Math.floor(max)

	return Math.floor(Math.random() * (roundedMax - roundedMin + 1)) + roundedMin
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
			prisma.$executeRawUnsafe(`TRUNCATE TABLE "${tablename}" CASCADE;`)
		),
		// Enable FK constraints
		prisma.$executeRawUnsafe(`SET session_replication_role = 'origin';`)
	])
}
