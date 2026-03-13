import axios from "axios";
import { useEffect, useState } from "react";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";

import CategoryChart from "../components/charts/CategoryChart";
import TrendChart from "../components/charts/TrendChart";
import PaymentChart from "../components/charts/PaymentChart";

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);
  const [loading, setLoading] = useState(true);

  const [summary, setSummary] = useState(null);
  const [categories, setCategories] = useState([]);
  const [trend, setTrend] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchAnalytics = async () => {
    try {
      const query = `?startDate=${startDate}&endDate=${endDate}`;

      const [summaryRes, categoryRes, trendRes, paymentMethodRes] =
        await Promise.all([
          axios.get(`http://localhost:5000/api/analytics/summary${query}`),
          axios.get(`http://localhost:5000/api/analytics/category${query}`),
          axios.get(`http://localhost:5000/api/analytics/trend${query}`),
          axios.get(
            `http://localhost:5000/api/analytics/payment-method${query}`,
          ),
        ]);

      setSummary(summaryRes.data.data);
      setCategories(categoryRes.data.data);
      setTrend(trendRes.data.data);
      setPaymentMethods(paymentMethodRes.data.data);
    } catch (err) {
      console.error("Analytics error", err);
    }
  };

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
    fetchAnalytics();
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [startDate, endDate]);

  const onAdd = async (expense) => {
    const res = await axios.post("http://localhost:5000/api/expenses", expense);
    setExpenses((prev) => [res.data, ...prev]);
    fetchAnalytics();
  };

  const onDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/expenses/${id}`);
      setExpenses((prev) => prev.filter((exp) => exp._id !== id));
      fetchAnalytics();
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
      fetchAnalytics();
    } catch (error) {
      console.error("Failed to update expense", error);
    }
  };

  const handleCancel = () => {
    setEditingExpense(null);
  };

  if (loading) {
    return <p>Loading Expenses...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-6">
      <div className="w-full max-w-xl bg-white rounded-lg shadow p-6 space-y-6">
        <h1 className="text-center text-4xl font-bold text-gray-800">
          Expense Dashboard
        </h1>
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
            ${summary?.total || 0}
          </span>
        </div>

        <div className="flex justify-between border rounded ">
          <label>From:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />

          <label>To:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        {summary && (
          <div className="grid grid-cols-3 gap-4 bg-blue-50 p-4 rounded-lg border border-blue-200 items-center text-center"> 
            <div>
              <h3 className="text-lg font-medium text-blue-700">Total</h3>
              <p className="text-2xl font-medium text-blue-900">${summary.total}</p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-blue-700">Transactions</h3>
              <p className="text-2xl font-medium text-blue-900">{summary.count}</p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-blue-700">Average</h3>
              <p className="text-2xl font-medium text-blue-900">${summary.average}</p>
            </div>
          </div>
        )}

        <h2 className="text-xl font-semibold">Category Analytics</h2>

        {categories.map((item) => (
          <div key={item.category} className="flex justify-between">
            <span>{item.category}</span>
            <span>${item.total}</span>
          </div>
        ))}

        <h2 className="text-xl font-semibold">Payment Methods</h2>

        {paymentMethods.map((item) => (
          <div key={item.paymentMethod} className="flex justify-between">
            <span>{item.paymentMethod}</span>
            <span>${item.total}</span>
          </div>
        ))}

        <h2 className="text-xl font-semibold">Daily Trend</h2>

        {trend.map((item) => (
          <div key={item.date} className="flex justify-between">
            <span>{item.date}</span>
            <span>${item.total}</span>
          </div>
        ))}

        {categories.length > 0 && (
          <CategoryChart data={categories}/>
        )}

        {paymentMethods.length > 0 && (
          <PaymentChart data={paymentMethods}/>
        )} 

        {trend.length > 0 && (
          <TrendChart data={trend}/>
        )}  

        <ExpenseList
          expenses={expenses}
          onEdit={setEditingExpense}
          onDelete={onDelete}
        />
      </div>
    </div>
  );
}
