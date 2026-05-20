import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { prisma } from "../lib/prisma.js";
import { createTransactionSchema, transactionQuerySchema } from "../schemas/transaction.schemas.js";
import type {
    TransactionWhereInput,
    TransactionOrderByWithRelationInput,
} from "../../generated/prisma/models/Transaction.js";

const transactionRouter = Router();

transactionRouter.get("/", requireAuth, async(req, res)=>{
    if(!req.userId){
        return res.status(401).json({message: "Unauthorised"});
    }
    const userId = req.userId;

    const result = transactionQuerySchema.safeParse(req.query);
    if(!result.success){
        return res.status(400).json({
            message: "Invalid transaction query",
            errors: result.error.flatten(),
        });
    }

    const{
        page,
        limit,
        type,
        categoryId,
        from,
        to,
        sortBy,
        sortOrder,
    } = result.data;

    const skip = (page - 1) * limit;

    const where: TransactionWhereInput = {
        userId
    };

    if (type){
        where.type = type;
    }

    if(categoryId){
        where.categoryId = categoryId;
    }

    if(from || to){
        where.date = {} ;
        if(from){
            where.date.gte = from;
        }

        if(to){
            where.date.lte = to;
        }
    }

    const orderBy : TransactionOrderByWithRelationInput = {
        [sortBy] : sortOrder,
    };

    const transactions = await prisma.transaction.findMany({
        where,
        orderBy,
        skip,
        take: limit,
    });

    const total = await prisma.transaction.count({
        where,
    });
    const totalPages = Math.ceil(total / limit);

    return res.status(200).json({
        transactions,
        pagination: {
            page,
            limit,
            total,
            totalPages,
        },
    });
});

transactionRouter.post("/", requireAuth, async(req, res) => {
    if(!req.userId){
        return res.status(401).json({ message: "Unauthorised "});
    }
    const userId = req.userId;
    const result = createTransactionSchema.safeParse(req.body);

      if (!result.success){
        return res.status(400).json({
            message: "Invalid transaction input", 
            errors: result.error.flatten() });
    }


    const { description, amountMinor, type, date, categoryId } = result.data;


  
    if (categoryId){
        const categoryValidation = await prisma.category.findFirst({
            where:{
                id: categoryId,
                userId,
                type,
            }
        });
        if (!categoryValidation){
            return res.status(400).json({message: "category not found"});
        }
    }

    const transaction = await prisma.transaction.create({
        data:{
            description,
            amountMinor,
            type,
            date,
            categoryId : categoryId ?? null,
            userId,
        }
    });
    return res.status(201).json({ transaction });
});

transactionRouter.put<{id: string}>("/:id", requireAuth, async(req, res)=>{
    if (!req.userId){
        return res.status(401).json({ message: "Unauthorised "});
    }
    const userId = req.userId;
    const id = req.params.id;
    const result = createTransactionSchema.safeParse(req.body);
    if (!result.success){
        return res.status(400).json({
            message: "invalid transaction request",
            errors: result.error.flatten(),
        })
    }

    const { description, amountMinor, type, date, categoryId } = result.data;

    const transactionValidation = await prisma.transaction.findFirst({
        where:{
            id,
            userId,
        }
    });

    if (!transactionValidation){
        return res.status(404).json({message : "transaction not found"});
    }

    if(categoryId){
        const categoryValidation = await prisma.category.findFirst({
            where:{
                id: categoryId,
                userId,
                type,
            }
        });
        if (!categoryValidation){
            return res.status(404).json({ message: "Category not found"});
        }
    }

    const updatedTransaction = await prisma.transaction.update({
        where:{
            id: transactionValidation.id,
        },
        data:{
            description,
            amountMinor,
            type,
            date,
            categoryId: categoryId ?? null,
        }
    });

    return res.status(200).json({ transaction: updatedTransaction });
});

transactionRouter.delete<{id: string}>("/:id", requireAuth, async(req, res) =>{
    if(!req.userId){
        return res.status(401).json({message:"Unauthorised"});
    }
    const userId = req.userId;
    const { id } = req.params;

    const result = await prisma.transaction.deleteMany({
        where:{
            id,
            userId,
        }
    });

    if(result.count === 0){
        return res.status(404).json({message: "Transaction not found"});
    }

    res.status(204).send();

});



export default transactionRouter;