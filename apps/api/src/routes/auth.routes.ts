import { Router } from "express";
import { registerSchema } from "../schemas/auth.schemas.js";

const authRouter = Router();

authRouter.post('/login',(req, res) => {
    res.status(200).json({status: "login post route"});
});

authRouter.post('/register',(req, res) => {
    const result = registerSchema.safeParse(req.body);

    if(!result.success){
        res.status(400).json({
            message: "invalid register request",
            errors: result.error.flatten(),
        });
        return;
    }

    res.status(200).json({
        status: "valid body request",
        data: result.data,
    });

});

export default authRouter;