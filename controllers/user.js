import { User } from "../models/user.js";
import bcrypt from "bcryptjs";
import { loginValidator, registerValidator, updateProfileValidator } from "../validators/user.js";


import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'yourSecretKey';

export const register = async (req, res, next) => {
    try {
        // Validate request data
        const { error, value } = registerValidator.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const { name, email, password, ...rest } = value;
        
        // Check required fields
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        
        // Check password length
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }
        
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 12);
        
        // Create the user
        const newUser = new User({
            name,
            email,
            ...rest,
            password: hashedPassword
        });

        const user = await newUser.save();

        // Generate JWT if user creation is successful
        if (user) {
            const token = jwt.sign(
                { _id: user._id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: '1d' });
            
            const response = {
                token, 
                user
            }
            // Send the response to the client
            return res.status(201).json(response);
        } else {
            return res.status(400).json({ message: "Invalid user data received" });
        }
    } catch (error) {
        next(error);
    }
};

export const login = async (req, res, next) => {
    try {
        const { error, value } = loginValidator.validate(req.body);
        if (error) {
            return res.status(422).json({ error: 'Validation failed', details: error.details });
        }
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User does not exist" });
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (user && isPasswordMatch) {
            res.status(200).json({ _id: user._id, name: user.name, email: user.email });
        }
    } catch (error) {
        next(error);
    }
}

export const getProfile = async (req, res, next) => {
    try {
        const user = await User
            .findById(req.auth.id)
            .select({ password: false });
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
}

export const updateProfile = async (req, res, next) => {
    try {
        const { error, value } = updateProfileValidator.validate({
            ...req.body,
            avatar: req.file?.filename
        });

        if (error) {
            return res.status(422).json({ error: 'Validation failed', details: error.details });
        }

        const oldUser = await User.findById(req.auth.id);


        // Update user profile
        const user = await User.findByIdAndUpdate(req.auth.id, value, { new: true });


        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });
        const response = {
            token,
            user
        };
        return res.status(200).json(response);

    } catch (error) {
        next(error);
    }
}


export const logout = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const blackListedToken = await BlackList.create({ token });
        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        next(error);
    }
}