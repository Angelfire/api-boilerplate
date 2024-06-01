import express, { type Express, type Request, type Response } from "express"

import { errorHandler } from "./middleware/error-handler"
import { logger } from "./middleware/log-events"
import { limiter } from "./middleware/rate-limit"

import userRouter from "./routes/user-routes"

const PORT = process.env.API_PORT ?? 8080

const app: Express = express()

// Disable x-powered-by header for security reasons (optional)
app.disable("x-powered-by")

// custom middleware logger
app.use(logger)

// Apply the rate limiting middleware to all requests
app.use(limiter)

// Middleware to parse incoming requests with JSON payloads
app.use(express.json())

// User routes (v1)
app.use("/v1/users", userRouter)

// 404 route handler (optional)
// This should be the last route handler in the file to catch all routes that are not defined above it
app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: "Not found" })
})

// Error handler middleware
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`App running on http://localhost:${PORT}`)
})
