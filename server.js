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

// Serve all HTML/CSS/JS files from the project folder
app.use(express.static(__dirname));

// MongoDB connection
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
      console.log("MongoDB Connected Successfully");
    })
    .catch((error) => {
      console.error("MongoDB Connection Error:", error.message);
    });
} else {
  console.log("MONGODB_URI is not set");
}

// Application schema
const ApplicationSchema = new mongoose.Schema(
  {
    fullName: String,
    phone: String,
    email: String,
    idNumber: String,
    amount: String,
    employment: String,
    income: String,
    purpose: String,
    status: {
      type: String,
      default: "Pending"
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    collection: "applications"
  }
);

const Application = mongoose.model("Application", ApplicationSchema);

// Home page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Apply page
app.get("/apply", (req, res) => {
  res.sendFile(path.join(__dirname, "apply.html"));
});

// Details page
app.get("/details", (req, res) => {
  res.sendFile(path.join(__dirname, "details.html"));
});

// Employment page
app.get("/employment", (req, res) => {
  res.sendFile(path.join(__dirname, "employment.html"));
});

// Loan page
app.get("/loan", (req, res) => {
  res.sendFile(path.join(__dirname, "loan.html"));
});

// Review page
app.get("/review", (req, res) => {
  res.sendFile(path.join(__dirname, "review.html"));
});

// Success page
app.get("/success", (req, res) => {
  res.sendFile(path.join(__dirname, "success.html"));
});

// Login page
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "login.html"));
});

// Admin page
app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "admin.html"));
});

// Submit loan application
app.post("/api/applications", async (req, res) => {
  try {
    const application = new Application(req.body);

    const savedApplication = await application.save();

    console.log("Application saved:", savedApplication._id);

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      application: savedApplication
    });
  } catch (error) {
    console.error("Application submission error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to submit application",
      error: error.message
    });
  }
});

// Get all applications for admin
app.get("/api/applications", async (req, res) => {
  try {
    const applications = await Application.find()
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      applications: applications
    });
  } catch (error) {
    console.error("Error loading applications:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load applications"
    });
  }
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "LoanEase server is running"
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`LoanEase server running on port ${PORT}`);
});
