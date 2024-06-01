import type { Request, Response } from "express"
import { logEvents } from "./log-events"

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
): void => {
  logEvents(`${err.name}: ${err.message}`, "errLog.txt")
  console.error(err.stack)
  res.status(500).send(err.message)
}
