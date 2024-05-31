import { Router } from "express"

import {
  createUser,
  getAllUsers,
  getUserByIdentifier,
} from "../controllers/user-controller"

const router = Router()

router.get("/", getAllUsers)
router.get("/:identifier", getUserByIdentifier)
router.post("/", createUser)

export default router
