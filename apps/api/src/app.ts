import express from "express"
import cors from "cors"
import authRouter from "./routes/auth.routes.js";
import categoryRouter from "./routes/category.routes.js";
import transactionRouter from "./routes/transaction.routes.js";
import fixedPaymentRouter from "./routes/fixed-payment.routes.js";


const app = express();


const clientOrigin = process.env.CLIENT_ORIGIN ?? "http://localhost:5173";

app.use(cors({
    origin: clientOrigin,
}));

app.use(express.json());
app.use("/auth", authRouter);
app.use("/categories", categoryRouter);
app.use("/transactions", transactionRouter);
app.use("/fixed-payments", fixedPaymentRouter);


app.get('/health', (_req, res) => {
    res.status(200).json({status: "ok"});
});


app.get('/', (_req, res) => {
    res.status(200).json({status: "all good"});
});


export default app;
