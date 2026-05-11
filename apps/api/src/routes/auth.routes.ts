import { Router } from "express";

const authRouter = Router();

authRouter.post('/login',(req, res) => {
    res.status(200).json({status: "login post route"});
});

authRouter.post('/register',(req, res) => {
    res.status(200).json({status: "register post route"});
});

export default authRouter;