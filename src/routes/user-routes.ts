import { Router } from "express"

import {
  createUser,
  deleteUserByIdentifier,
  getAllUsers,
  getUserByIdentifier,
} from "../controllers/user-controller"

const router = Router()

router.get("/", getAllUsers)
router.get("/:identifier", getUserByIdentifier)
router.post("/", createUser)
router.delete("/:identifier", deleteUserByIdentifier)

export default router
