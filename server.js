const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// Loan Application Schema
const ApplicationSchema = new mongoose.Schema({
  id: String,
  fullName: String,
  phone: String,
  email: String,
  country: String,
  idNumber: String,
  pin: String,
  loanAmount: String,
  loanPurpose: String,
  repaymentPeriod: String,
  status: {
    type: String,
    default: "Pending"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Application = mongoose.model("Application", ApplicationSchema);

// Submit Application
app.post("/api/apply", async (req, res) => {
  try {
    const application = new Application({
      id: "LE" + Math.floor(100000 + Math.random() * 900000),
      ...req.body
    });

    await application.save();

    res.json({
      success: true,
      id: application.id
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to save application."
    });
  }
});

// View Applications
app.get("/api/applications", async (req, res) => {
  const applications = await Application.find().sort({createdAt:-1});
  res.json(applications);
});

app.listen(PORT, () => {
  console.log(`LoanEase server running on port ${PORT}`);
});
