const express = require("express");
const cors = require("cors");
const pool = require("./config/db");
const problemRoutes = require("./routes/problemRoutes");
const validationRoutes = require("./routes/validationRoutes");
const builderRoutes = require("./routes/builderRoutes");
const matchingRoutes = require("./routes/matchingRoutes");
const teamRoutes = require("./routes/teamRoutes");
const progressRoutes = require("./routes/progressRoutes");
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/problems", problemRoutes);
app.use("/api/validations", validationRoutes);
app.use("/api/builders", builderRoutes);
app.use("/api/matching", matchingRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.get("/api/health", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      success: true,
      message: "SOLVIFY backend is running",
      database: "PostgreSQL connected",
      time: result.rows[0].now,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`SOLVIFY backend running on http://localhost:${PORT}`);
});