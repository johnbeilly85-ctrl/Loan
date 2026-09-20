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
