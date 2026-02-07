import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import ConnectDB from "./db/ConnectDB.js";
import expenseRoutes from "./routes/expense.js"

dotenv.config();
ConnectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/expenses", expenseRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=> {
    console.log(`Server connected to port ${PORT}`);
});