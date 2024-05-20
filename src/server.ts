import express, { type Express, type Request, type Response } from "express"

const PORT = process.env.API_PORT || 8080

const app: Express = express()

app.get('/', (req: Request, res: Response) => {
	res.json({ message: "It's working" })
})

app.listen(PORT, () => {
	console.log(`App runing on ${PORT}`)
})
