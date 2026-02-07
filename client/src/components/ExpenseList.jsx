import ExpenseItem from "./ExpenseItem";

export default function ExpenseList({ expenses, onEdit, onDelete }) {
  return (
    <>
      {expenses.length === 0 ? (
        <h2 className="text-center text-gray-500">
          No expenses yet. Add one to get started
        </h2>
      ) : (
        expenses.map((expense) => (
          <div className="space-y-4">
            <ExpenseItem
              key={expense._id}
              expense={expense}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </div>
        ))
      )}
    </>
  );
}
