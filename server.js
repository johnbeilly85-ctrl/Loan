
// MongoDB Connection
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log("MongoDB Error:", err));
}

// Loan Application Schema
const ApplicationSchema = new mongoose.Schema({
  id: String,
  fullName: String,
  phone: String,
  idNumber: String,
  amount: String,
  status: { type: String, default: "Pending" },
  createdAt: { type: Date, default: Date.now }
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
      applicationId: application.id
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

// View Applications
app.get("/api/applications", async (req, res) => {
  const apps = await Application.find().sort({ createdAt: -1 });
  res.json(apps);
});

// Serve Website
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`LoanEase running on port ${PORT}`);
});
