import express from "express";
import ExpenseDB from "../db/ExpenseDB.js";

const router = express.Router();

router.post("/", async(req, res) => {

    try {

        const {amount, category, createdAt} = req.body;

        const expenseData = await ExpenseDB.create({
            amount,
            category,
            createdAt
        });

        res.status(201).json(expenseData);

    } catch (error) {
        res.status(500).json({error: "Failed to add expense"});
    }
});

router.get("/", async (req, res) => {
        try {
            const expenses = await ExpenseDB.find().sort({createdAt: -1});
            res.json(expenses);
        } catch (error) {
            res.status(500).json({error: "Failed to fetch expenses"})
        }
});

router.get("/:id", async (req, res) => {
    try {
        const expense = await ExpenseDB.findById(req.params.id);
        if (!expense) return res.status(404).json({error: "Expense not found"})
        res.json(expense);
    } catch (error) {
        res.status(500).json({error: "Failed to fetch expense"});
    }
});

router.put("/:id", async (req, res) => {
    try {
        const updatedExpense = await ExpenseDB.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new: true}
        );
        res.json(updatedExpense);
    } catch (error) {
        res.status(500).json({error: "Failed to update expense"});
    }
});

router.delete("/:id", async (req, res) => {
    
    try {
        await ExpenseDB.findByIdAndDelete(req.params.id);
        res.json({message: "Expense Deleted"});
    } catch (error) {
        res.status(500).json({error: "failed to to delete expense"});
    }

});

export default router;