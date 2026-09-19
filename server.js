const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve the website files
app.use(express.static(__dirname));

// Homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

let applications = [];

// Loan application
app.post("/api/apply", (req, res) => {
  const application = {
    id: "LE" + Math.floor(100000 + Math.random() * 900000),
    ...req.body,
    status: "Pending"
  };

  applications.push(application);

  res.json(application);
});

// View applications
app.get("/api/applications", (req, res) => {
  res.json(applications);
});

app.listen(PORT, () => {
  console.log(`LoanEase server running on port ${PORT}`);
});
