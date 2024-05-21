import { type Prisma, PrismaClient } from '@prisma/client'

import {
	cleanupDb,
	createPassword,
	generateRandomString,
	getRandomInt
} from '../tests/db-utilts.js'

const prisma = new PrismaClient()

async function seed() {
	console.time('🧹 Cleaned up the database...')
	await cleanupDb(prisma)
	console.timeEnd('🧹 Cleaned up the database...')

	console.time('🔑 Created permissions...')
	const entities = ['user', 'post']
	const actions = ['create', 'read', 'update', 'delete']
	const accesses = ['own', 'any'] as const

	const permissionsToCreate = []
	for (const entity of entities) {
		for (const action of actions) {
			for (const access of accesses) {
				permissionsToCreate.push({ entity, action, access })
			}
		}
	}
	await prisma.permission.createMany({ data: permissionsToCreate })
	console.timeEnd('🔑 Created permissions...')

	console.time('👑 Created roles...')
	await prisma.role.create({
		data: {
			name: 'admin',
			permissions: {
				connect: await prisma.permission.findMany({
					select: { id: true },
					where: { access: 'any' }
				})
			}
		}
	})
	await prisma.role.create({
		data: {
			name: 'user',
			permissions: {
				connect: await prisma.permission.findMany({
					select: { id: true },
					where: { access: 'own' }
				})
			}
		}
	})
	console.timeEnd('👑 Created roles...')

	const userData: Prisma.UserCreateInput[] = [
		{
			email: 'andres@srhart.co',
			username: 'Andreshart',
			password: { create: createPassword('Andreshart') },
			roles: { connect: { name: 'user' } },
			posts: {
				create: Array.from({
					length: getRandomInt(1, 3)
				}).map(() => ({
					title: generateRandomString(10),
					content: generateRandomString(120)
				}))
			}
		},
		{
			email: 'john@srhart.co',
			username: 'Johnhart',
			password: { create: createPassword('Johnhart') },
			roles: { connect: { name: 'user' } },
			posts: {
				create: Array.from({
					length: getRandomInt(1, 3)
				}).map(() => ({
					title: generateRandomString(10),
					content: generateRandomString(120)
				}))
			}
		},
		{
			email: 'jane@srhart.co',
			username: 'Janehart',
			password: { create: createPassword('Janehart') },
			roles: { connect: { name: 'user' } },
			posts: {
				create: Array.from({
					length: getRandomInt(1, 3)
				}).map(() => ({
					title: generateRandomString(10),
					content: generateRandomString(120)
				}))
			}
		}
	]
	console.time(`👤 Created ${userData.length} users...`)
	for (const u of userData) {
		await prisma.user
			.create({
				select: { id: true },
				data: u
			})
			.catch(e => {
				console.error('Error creating a user:', e)
				return null
			})
	}
	console.timeEnd(`👤 Created ${userData.length} users...`)

	console.time(`🔥 Created admin user "Andy"`)
	await prisma.user.create({
		select: { id: true },
		data: {
			email: 'andy@srhart.co',
			username: 'SrHart',
			password: { create: createPassword('Andylovesyou') },
			roles: { connect: [{ name: 'admin' }, { name: 'user' }] },
			posts: {
				create: [
					{
						id: 'd27a197e',
						title: 'Basic Andy Facts',
						content:
							'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
					},
					{
						id: '414f0c09',
						title: 'Andy likes bears',
						content:
							'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
					},
					{
						id: '260366b1',
						title: 'Not bears',
						content:
							'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
					}
				]
			}
		}
	})
	console.timeEnd(`🔥 Created admin user "Andy"`)
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
