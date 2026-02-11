import prisma from "../utils/db.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { addId } from "../utils/format.js";

export const registerCompany = async (req, res) => {
    try {
        const { companyName } = req.body;
        if (!companyName) {
            return res.status(400).json({
                message: "Company name is required.",
                success: false
            });
        }
        const existing = await prisma.company.findUnique({ where: { name: companyName } });
        if (existing) {
            return res.status(400).json({
                message: "You can't register same company.",
                success: false
            });
        }
        const company = await prisma.company.create({
            data: {
                name: companyName,
                userId: req.id
            }
        });

        return res.status(201).json({
            message: "Company registered successfully.",
            company: addId(company),
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}
export const getCompany = async (req, res) => {
    try {
        const userId = req.id;
        const companies = await prisma.company.findMany({ where: { userId } });
        return res.status(200).json({
            companies: companies.map(c => addId(c)),
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}
export const getCompanyById = async (req, res) => {
    try {
        const companyId = req.params.id;
        const company = await prisma.company.findUnique({ where: { id: companyId } });
        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            });
        }
        return res.status(200).json({
            company: addId(company),
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}
export const updateCompany = async (req, res) => {
    try {
        const { name, description, website, location } = req.body;

        const updateData = {};
        if (name !== undefined) updateData.name = name;
        if (description !== undefined) updateData.description = description;
        if (website !== undefined) updateData.website = website;
        if (location !== undefined) updateData.location = location;

        const file = req.file;
        if (file) {
            const fileUri = getDataUri(file);
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
                resource_type: 'auto'
            });
            updateData.logo = cloudResponse.secure_url;
        }

        const company = await prisma.company.update({
            where: { id: req.params.id },
            data: updateData
        }).catch(e => {
            if (e.code === 'P2025') return null;
            throw e;
        });

        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            });
        }
        return res.status(200).json({
            message: "Company information updated.",
            success: true
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}
export const listCompanies = async (req, res) => {
    try {
        const name = (req.query.name || req.query.q || '').toString();
        const location = (req.query.location || '').toString();

        const where = {};
        if (name) where.name = { contains: name, mode: 'insensitive' };
        if (location) where.location = { contains: location, mode: 'insensitive' };

        const companies = await prisma.company.findMany({
            where,
            orderBy: { createdAt: 'desc' }
        });
        return res.status(200).json({ companies: companies.map(c => addId(c)), success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}