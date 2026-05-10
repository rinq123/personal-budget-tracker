import "dotenv/config";
import app from "./app.js";


const port = Number(process.env.PORT ?? 4000);

if(Number.isNaN(port)) {
    throw new Error("PORT must be a number");
}

app.listen(port , () => {
    console.log(`API running on http://localhost:${port}`);
});