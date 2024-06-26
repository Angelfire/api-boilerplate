import { rateLimit } from "express-rate-limit"

export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 100 requests per windowMs
  message: { error: "Too many requests from this IP, please try again later." },
  legacyHeaders: false, // Do not use X-RateLimit-* headers
})
