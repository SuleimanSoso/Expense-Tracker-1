import axios from "axios";
import { useEffect, useState } from "react";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";
import ExpenseItem from "../components/ExpenseItem";

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/expenses");
        setExpenses(res.data);
      } catch (error) {
        console.error("Failed to fetch expenses", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  const onAdd = async (expense) => {
    const res = await axios.post("http://localhost:5000/api/expenses", expense);
    setExpenses((prev) => [res.data, ...prev]);
  };

  const onDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/expenses/${id}`);
      setExpenses((prev) => prev.filter((exp) => exp._id !== id));
    } catch (error) {
      console.error("Failed to delete expense", error);
    }
  };

  const onUpdate = async (updatedExpense) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/expenses/${updatedExpense._id}`,
        updatedExpense,
      );

      setExpenses((prev) =>
        prev.map((exp) => (exp._id === updatedExpense._id ? res.data : exp)),
      );

      setEditingExpense(null);
    } catch (error) {
      console.error("Failed to update expense", error);
    }
  };

  const handleCancel = () => {
    setEditingExpense(null);
  };

  const calculateTotal = () => {
    return expenses.reduce((total, expense) => {
      return total + expense.amount;
    }, 0);
  };

  const calculateCategoryTotals = () => {
    return expenses.reduce((totals, expense) => {
      expense.category.forEach((cat) => {
        let splitAmount = expense.amount / expense.category.length;
        if (totals[cat]) {
          totals[cat] += splitAmount;
        } else {
          totals[cat] = splitAmount;
        }
      });

      return totals;
    }, {});
  };

  if (loading) {
    return <p>Loading Expenses...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-6">
      <div className="w-full max-w-xl bg-white rounded-lg shadow p-6 space-y-6">
        <h1 className="text-center text-4xl font-bold text-gray-800">Expense Dashboard</h1>
        <ExpenseForm
          onAdd={onAdd}
          onUpdate={onUpdate}
          editingExpense={editingExpense}
          handleCancel={handleCancel}
        />

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex justify-between items-center">
          <span className="text-lg font-medium text-blue-700">
            Total Expense
          </span>
          <span className="text-2xl font-bold text-blue-900">
            ${calculateTotal()}
          </span>
        </div>

        <ExpenseList
          expenses={expenses}
          onEdit={setEditingExpense}
          onDelete={onDelete}
        />

        <h2 className="text-xl font-semi-bold text-gray-800 mt-6">
          Category Totals
        </h2>

        <div className="space-y-2">
          {Object.entries(calculateCategoryTotals()).map(
            ([category, total]) => (
              <div
                key={category}
                className="flex justify-between bg-gray-100 rounded-md px-4 py-2"
              >
                <span className="font-medium text-gray-700">{category}</span>
                <span className="font-bold text-gray-900">${total}</span>
              </div>
            ),
          )}
        </div>
      </div>
    </div>
  );
}
