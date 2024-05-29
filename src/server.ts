import express, { type Express, type Request, type Response } from "express";

const PORT = process.env.API_PORT ?? 8080;

const app: Express = express();

// Disable x-powered-by header for security reasons (optional)
app.disable("x-powered-by");

// Middleware to parse incoming requests with JSON payloads
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "It's working" });
});

// 404 route handler (optional)
// This should be the last route handler in the file to catch all routes that are not defined above it
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: "Not found" });
});

app.listen(PORT, () => {
  console.log(`App runing on ${PORT}`);
});
