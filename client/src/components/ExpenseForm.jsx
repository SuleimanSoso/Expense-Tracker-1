import { useEffect, useState } from "react";
import axios from "axios";

export default function ExpenseForm({
  onAdd,
  onUpdate,
  editingExpense,
  handleCancel,
}) {
  const [amount, setAmount] = useState("");
  const [categories, setCategories] = useState("");

  useEffect(() => {
    if (editingExpense) {
      setAmount(editingExpense.amount);
      setCategories(editingExpense.category.join(", "));
    }
  }, [editingExpense]);

  const submitExpense = async (e) => {
    e.preventDefault();

    const expense = {
      amount: Number(amount),
      category: categories.split(",").map((c) => c.trim()),
    };

    if (editingExpense) {
      onUpdate({ ...editingExpense, ...expense });
    } else {
      onAdd(expense);
    }

    setAmount("");
    setCategories("");
  };

  return (
    <div className="bg-gray-100 rounded-lg p-4 space-y-4">
      <form onSubmit={submitExpense}>
        <input
          className="w-full border rounded focus:outline-none focus:ring"
          type="number"
          placeholder=" Enter Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />

        <input
          className="w-full border rounded focus:outline-none focus:ring"
          type="text"
          placeholder="Categories (Comma Separated)"
          value={categories}
          onChange={(e) => setCategories(e.target.value)}
          required
        />

        <div className="flex gap-2 justify-end ">
          {editingExpense && (
            <button className="bg-gray-400 text-white rounded-md px-4 py-2  hover:bg-gray-500 transition-colors duration-200 ease-in-out"
              type="button"
              onClick={() => {
                handleCancel();
                setAmount("");
                setCategories("");
              }}
            >
              {" "}
              Cancel
            </button>
          )}
          <button type="submit" className="bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600 transition-colors duration-200 ease-in-out"> 
            {editingExpense ? "Update Expense" : "Add Expense"}
          </button>
        </div>
      </form>
    </div>
  );
}
