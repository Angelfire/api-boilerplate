import { randomUUID } from "node:crypto"
import { existsSync, promises as fsPromises } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

import type { NextFunction, Request, Response } from "express"

import { getCurrentDateTime } from "../lib/utils"

export const logEvents = async (
  message: string,
  logName: string,
): Promise<void> => {
  const dateTime = getCurrentDateTime(new Date())
  const logItem = `${dateTime}\t${randomUUID()}\t${message}\n`
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)

  try {
    const logDir = path.join(__dirname, "..", "logs")
    if (!existsSync(logDir)) {
      await fsPromises.mkdir(logDir)
    }
    await fsPromises.appendFile(path.join(logDir, logName), logItem)
  } catch (err) {
    console.error(err)
  }
}

export const logger = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, "reqLog.txt")
  console.log(`${req.method} ${req.path}`)
  next()
}
