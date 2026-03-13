export default function ExpenseItem({ expense, onEdit, onDelete }) {
  const { _id, amount, category, createdAt } = expense;

  const handleDelete = (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this expense?",
    );

    if (isConfirmed) {
      onDelete(id);
    }
  };

  return (
    <div className=" bg-blue-100 rounded shadow p-5 space-y-2">
      <h3 className="text-3xl font-bold text-gray-800">Amount: ${amount}</h3>
      <p className="text-2xl font-bold text-gray-800">Categories: {category}</p>
      <p className=" text-xl font-semibold text-gray-600">Date: {new Date(createdAt).toLocaleDateString()}</p>
      <div className="gap-2 flex justify-end">
        <button className="bg-blue-400  text-white rounded-md px-4 py-2  hover:bg-blue-500 transition-colors duration-200 ease-in-out" onClick={() => onEdit(expense)}>
          Edit
        </button>
        <button  className="bg-red-400  text-white rounded-md px-4 py-2  hover:bg-red-500 transition-colors duration-200 ease-in-out" onClick={() => handleDelete(_id)}>Delete</button>
      </div>
    </div>
  );
}
