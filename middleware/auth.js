import { expressjwt } from "express-jwt";
import { User } from "../models/user.js";
import { permissions } from "../utils/rbac.js";

export const isAuthenticated = expressjwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
});

export const hasPermission = (action) => {
    return async (req, res, next) => {
        try {
            const user = await User.
                findById(req.auth._id);
            const permission = permissions.find((value) => value.role === user.role);
            if (!permission) {
                return res.status(403).json({ message: 'No permission found' });
            }
            if (permission.actions.includes(action)) {
                next();
            } else {
                res.status(403).json({ message: 'Action not allowed' });
            }
        } catch (error) {
            next(error)
        }
    }
}