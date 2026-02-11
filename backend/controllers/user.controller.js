import prisma from "../utils/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { formatUser } from "../utils/format.js";

const isProduction = process.env.NODE_ENV === 'production';

const cookieOptions = {
    maxAge: 1 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: isProduction ? 'none' : 'lax',
    secure: isProduction,
    path: '/'
};

export const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body;
         
        if (!fullname || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({
                message: "All fields are required",
                success: false
            });
        }
        const file = req.file;
        if (!file) {
            return res.status(400).json({
                message: "Profile image is required",
                success: false
            });
        }
        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
            resource_type: 'auto'
        });

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({
                message: 'User already exists with this email.',
                success: false,
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.create({
            data: {
                fullname,
                email,
                phoneNumber: String(phoneNumber),
                password: hashedPassword,
                role,
                profilePhoto: cloudResponse.secure_url,
            }
        });

        return res.status(201).json({
            message: "Account created successfully.",
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}

export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        
        if (!email || !password || !role) {
            return res.status(400).json({
                message: "All fields are required",
                success: false
            });
        }
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            });
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            });
        }
        if (role !== user.role) {
            return res.status(400).json({
                message: "Account doesn't exist with current role.",
                success: false
            });
        }

        const tokenData = { userId: user.id };
        const jwtSecret = process.env.JWT_SECRET || process.env.SECRET_KEY;
        const token = jwt.sign(tokenData, jwtSecret, { expiresIn: '1d' });

        return res.status(200).cookie("token", token, cookieOptions).json({
            message: `Welcome back ${user.fullname}`,
            user: formatUser(user),
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}

export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", {
            maxAge: 0,
            expires: new Date(0),
            httpOnly: true,
            sameSite: isProduction ? 'none' : 'lax',
            secure: isProduction,
            path: '/'
        }).json({
            message: "Logged out successfully.",
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}

export const updateProfile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills } = req.body;

        const file = req.file;
        let cloudResponse = null;
        if (file) {
            const fileUri = getDataUri(file);
            cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
                resource_type: 'auto'
            });
        }

        let skillsArray;
        if (skills) {
            skillsArray = skills.split(",");
        }
        const userId = req.id;

        const existingUser = await prisma.user.findUnique({ where: { id: userId } });
        if (!existingUser) {
            return res.status(400).json({
                message: "User not found.",
                success: false
            });
        }

        const updateData = {};
        if (fullname) updateData.fullname = fullname;
        if (email) updateData.email = email;
        if (phoneNumber) updateData.phoneNumber = String(phoneNumber);
        if (bio) updateData.bio = bio;
        if (skillsArray) updateData.skills = JSON.stringify(skillsArray);
        if (cloudResponse) {
            updateData.resume = cloudResponse.secure_url;
            updateData.resumeOriginalName = file.originalname;
        }

        const user = await prisma.user.update({
            where: { id: userId },
            data: updateData
        });

        return res.status(200).json({
            message: "Profile updated successfully.",
            user: formatUser(user),
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}