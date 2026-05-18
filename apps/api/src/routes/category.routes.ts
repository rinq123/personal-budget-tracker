import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { prisma } from "../lib/prisma.js";
import { createCategorySchema } from "../schemas/category.schemas.js";

const categoryRouter = Router();

categoryRouter.get("/", requireAuth, async(req, res) => {
    if (!req.userId){
        res.status(401).json ({ message : "Unauthorised"});
        return;
    }
    const userId = req.userId;

    const categories = await prisma.category.findMany({
        where: {userId},
        orderBy: {createdAt: "desc"},
    });
    return res.status(200).json({ categories });
});

categoryRouter.post("/", requireAuth, async(req, res)=>{
    if (!req.userId){
        res.status(401).json ({ message: "Unauthorised "});
        return;
    }

    const userId = req.userId;
    const result = createCategorySchema.safeParse(req.body);

    if(!result.success){
        res.status(400).json({
            message: "Invalid category name",
            errors : result.error.flatten(),
        });
        return;
    }

    const { name, type } = result.data;

    const category = await prisma.category.create({
        data:{
            name,
            type,
            userId
        },
    });
    return res.status(201).json({ category });

});

export default categoryRouter;