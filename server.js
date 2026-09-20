    default: Date.now
  }
});

const Application = mongoose.model("Application", ApplicationSchema);

// Submit Application
app.post("/api/apply", async (req, res) => {
  try {
    const application = new Application({
      id: "LE" + Math.floor(100000 + Math.random() * 900000),
      ...req.body,
      status: "Pending"
    });

    await application.save();

    res.json({
      success: true,
      id: application.id,
      status: application.status
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to submit application."
    });
  }
});

// Track Application
app.get("/api/application/:id", async (req, res) => {
  try {
    const application = await Application.findOne({ id: req.params.id });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found."
      });
    }

    res.json({
      success: true,
      application
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error."
    });
  }
});

// View All Applications
app.get("/api/applications", async (req, res) => {
  try {
    const applications = await Application.find().sort({ createdAt: -1 });
    res.json(applications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
});

// Home Route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  consol
