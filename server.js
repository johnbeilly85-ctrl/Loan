const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve website files
app.use(express.static(__dirname));

// MongoDB connection
if (process.env.MONGODB_URI) {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
      console.log("MongoDB connected successfully");
    })
    .catch((error) => {
      console.error("MongoDB connection error:", error.message);
    });
} else {
  console.log("MONGODB_URI is not set");
}

// Loan Application Schema
const loanApplicationSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    loanPurpose: {
      type: String,
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    period: {
      type: String,
      required: true
    },
    processingFee: {
      type: Number,
      required: true
    },
    totalAmountDue: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: true
  }
);

const LoanApplication = mongoose.model(
  "LoanApplication",
  loanApplicationSchema
);

// Home page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "LoanEase server is running"
  });
});

// SUBMIT LOAN APPLICATION
app.post("/api/apply", async (req, res) => {
  try {
    const {
      fullName,
      phone,
      loanPurpose,
      amount,
      period,
      processingFee,
      totalAmountDue
    } = req.body;

    // Validate required fields
    if (
      !fullName ||
      !phone ||
      !loanPurpose ||
      !amount ||
      !period
    ) {
      return res.status(400).json({
        success: false,
        message: "Please complete all required fields."
      });
    }

    // Create application
    const application = new LoanApplication({
      fullName,
      phone,
      loanPurpose,
      amount,
      period,
      processingFee,
      totalAmountDue
    });

    // Save to MongoDB
    await application.save();

    console.log("Loan application saved:", application._id);

    res.status(201).json({
      success: true,
      message: "Application submitted successfully."
    });

  } catch (error) {
    console.error("Application submission error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to save your application. Please try again."
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
