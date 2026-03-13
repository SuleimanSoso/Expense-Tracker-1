import express from "express";
import ExpenseDB from "../db/ExpenseDB.js";

const router = express.Router();

function buildDateFilter(startDate, endDate) {
  const match = {};

  if (startDate || endDate) {
    match.date = {};

    if (startDate) {
      match.date.$gte = new Date(startDate);
    }

    if (endDate) {
      match.date.$lte = new Date(endDate);
    }
  }

  return match;
}

router.get("/total", async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const match = buildDateFilter(startDate, endDate);

    const result = await ExpenseDB.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    const total = result[0]?.total || 0;

    res.json({
      success: true,
      total,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch total" });
  }
});

router.get("/category", async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const match = buildDateFilter(startDate, endDate);

    const data = await ExpenseDB.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
        },
      },

      {
        $project: {
          _id: 0,
          category: "$_id",
          total: 1,
        },
      },
    ]);

    res.json({
      success: true,
      data,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch category analytics" });
  }
});

router.get("/trend", async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const match = buildDateFilter(startDate, endDate);

    const data = await ExpenseDB.aggregate([
      { $match: match },

      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$date",
            },
          },

          total: { $sum: "$amount" },
        },
      },

      { $sort: { _id: 1 } },

      {
        $project: {
          _id: 0,
          date: "$_id",
          total: 1,
        },
      },
    ]);

    res.json({
      success: true,
      data,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch trend data" });
  }
});

router.get("/payment-method", async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const match = buildDateFilter(startDate, endDate);

    const data = await ExpenseDB.aggregate([
      { $match: match },

      {
        $group: {
          _id: { $ifNull: ["$paymentMethod", "Unknown"] },
          total: { $sum: "$amount" },
        },
      },

      { $sort: { total: -1 } },

      {
        $project: {
          _id: 0,
          paymentMethod: "$_id",
          total: 1,
        },
      },
    ]);

    res.json({
      success: true,
      data,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch payment method analytics" });
  }
});

router.get("/summary", async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const match = buildDateFilter(startDate, endDate);

    const result = await ExpenseDB.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
          count: { $sum: 1 },
          average: { $avg: "$amount" },
        },
      },

      {
        $project: {
          _id: 0,
          total: 1,
          count: 1,
          average: { $round: ["$average", 2] },
        },
      },
    ]);

    const data = result[0] || { total: 0, count: 0, average: 0 }

    res.json({
        success: true,
        data
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch summary" });
  }
});

export default router;
