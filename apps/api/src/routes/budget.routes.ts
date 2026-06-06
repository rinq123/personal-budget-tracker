import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import { prisma } from '../lib/prisma.js';
import { createBudgetsSchema } from '../schemas/budget.schemas.js';
import { budgetQuerySchema } from '../schemas/budget.schemas.js';
import { Prisma } from '../../generated/prisma/client.js';

const budgetRouter = Router();

//Opted to return all budgets instead as product direction changed.
//Users will now be only limited 10 budget templates instead of many
budgetRouter.get("/", requireAuth, async(req, res) => {
    if(!req.userId){
        return res.status(401).json({ message: "Unauthorised" });
    }

    const result = budgetQuerySchema.safeParse(req.query);
    if(!result.success){
        return res.status(400).json({
            message: "Invalid budgets query",
            errors: result.error.flatten(),
        });
    }


    const budgets = await prisma.budget.findMany({
        where: {
            userId: req.userId,
        },
        include:{
            category: true,
        },
        orderBy:[
            { category: { name: "asc"}},
        ],
    });

    return res.status(200).json({ budgets });
});


budgetRouter.post("/", requireAuth, async(req,res) =>{
    if(!req.userId){
        return res.status(401).json({ message: "Unauthorised "});
    }
    const result = createBudgetsSchema.safeParse(req.body);

    if(!result.success){
        res.status(400).json({
            message: "Invalid budget request",
            errors: result.error.flatten(),
        });
        return;
    }

    const { categoryId, amountMinor } = result.data;

    const category = await prisma.category.findFirst({
        where:{
            id: categoryId,
            userId: req.userId,
            type: "EXPENSE",
        },
    });

    if(!category){
        return res.status(400).json({ message: "Category not found"});
    }


    const existingBudget = await prisma.budget.findFirst({
        where:{
            userId: req.userId,
            categoryId,
        },
    });

    if(existingBudget){
        return res.status(409).json({
            message: "A budget for this category already exists",
        });
    }

    //race condition check
    try{
        const budget = await prisma.budget.create({
            data:{
                amountMinor,
                categoryId,
                userId: req.userId,
            },
        });
        return res.status(201).json({ budget });
    } catch ( error ){
        if(
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2002"
        ) {
            return res.status(409).json({
                message: "A budget for this category already exists",
            });
        }
        throw error;
    }
});

budgetRouter.put<{id : string}>("/:id", requireAuth, async(req, res) =>{
    if (!req.userId){
        return res.status(401).json({ message: "Unauthorised "});
    }

    const userId = req.userId;
    const id = req.params.id;
    const result = createBudgetsSchema.safeParse(req.body);
    if(!result.success){
        return res.status(400).json({
            message: "Invalid budget query request",
            error: result.error.flatten(),
        })
    }

    const { categoryId, amountMinor } = result.data;

    const budgetValidation = await prisma.budget.findFirst({
        where: {
            id,
            userId,
        }
    });

    if(!budgetValidation){
        return res.status(404).json({ message: "budget template not found"});
    }
    
    if(categoryId){
        const categoryValidation = await prisma.category.findFirst({
            where:{
                id: categoryId,
                userId,
                type:"EXPENSE"
            }
        });

        if(!categoryValidation){
            return res.status(400).json({ message: "Category not found "});
        }
    }

    const duplicateBudget = await prisma.budget.findFirst({
        where:{
            userId,
            categoryId,
            id:{
                not : id,
            },
        },
    });

    if(duplicateBudget){
        return res.status(409).json({
            message: "A budget for this category already exists",
        });
    }

    //race condition check
    
    try {
        const updatedBudget = await prisma.budget.update({
            where: {
                id : budgetValidation.id,
            },
            data:{
                categoryId,
                amountMinor,
            },
        });

        return res.status(200).json({ updatedBudget});
    } catch (error){
        if(
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2002"
        ) {
            return res.status(409).json({
                message: "A budget for this category already exists"
            });
        }

        throw error;
    }
    
});


budgetRouter.delete<{id : string}>("/:id", requireAuth, async(req, res)=>{
    if(!req.userId){
        return res.status(401).json({ message : "Unauthorised "});
    }
    const id = req.params.id;
    const userId = req.userId;

    const result = await prisma.budget.deleteMany({
        where:{
            userId,
            id,
        }
    });

    if(result.count === 0){
        return res.status(404).json({message:"Budget not found"});
    }

    res.status(204).send();
});

export default budgetRouter;