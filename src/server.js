import express from 'express'

const PORT = process.env.API_PORT || 8080

const app = express()

app.get('/', (req, res) => {
	res.json({ message: "It's working" })
})

app.listen(PORT, () => {
	console.log(`App runing on ${PORT}`)
})
