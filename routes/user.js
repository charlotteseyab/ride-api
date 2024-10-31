import { Router } from "express";
import { getProfile, login, logout, register, updateProfile } from "../controllers/user.js";
import { hasPermission, isAuthenticated } from "../middleware/auth.js";



export const userRouter = Router()

userRouter.post('/register', register)

userRouter.post('/login', login)

userRouter.get('/profile/:id', isAuthenticated, getProfile)

userRouter.patch('/profile/:id',isAuthenticated, hasPermission('updateProfile'), updateProfile)


userRouter.post('/logout', logout)

export default userRouter