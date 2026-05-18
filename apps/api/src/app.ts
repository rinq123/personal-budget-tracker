import express from "express"
import cors from "cors"
import authRouter from "./routes/auth.routes.js";
import categoryRouter from "./routes/category.routes.js";


const app = express();


const clientOrigin = process.env.CLIENT_ORIGIN ?? "http://localhost:5173";

app.use(cors({
    origin: clientOrigin,
}));

app.use(express.json());
app.use("/auth", authRouter);
app.use("/categories", categoryRouter);


app.get('/health', (_req, res) => {
    res.status(200).json({status: "ok"});
});


app.get('/', (_req, res) => {
    res.status(200).json({status: "all good"});
});


export default app;
