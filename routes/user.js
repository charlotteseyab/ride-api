import { Router } from "express";
import { getProfile, login, logout, register, updateProfile } from "../controllers/user.js";
import { hasPermission, isAuthenticated } from "../middleware/auth.js";



export const userRouter = Router()

userRouter.post('/register', register)

userRouter.post('/login', login)

userRouter.get('/profile', isAuthenticated, getProfile)

userRouter.patch('/profile/:id',isAuthenticated, hasPermission('update_Profile'), updateProfile)

userRouter.post('/logout', logout)

export default userRouter