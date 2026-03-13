import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      min: 0,
      required: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    date: {
        type: Date,
        required: true,
        default: Date.now
    },

    description: {
      type: String,
      trim: true,
    },

    paymentMethod: {
      type: String,
      enum: ["Cash", "Card", "Bank", "Digital Wallet", "BNPL"],
      default: "Cash"
    },
  },

  {
    timestamps: true,
  },
);

export default mongoose.model("Expense", expenseSchema);
