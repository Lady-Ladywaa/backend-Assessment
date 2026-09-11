const express = require("express");
const cors = require("cors");

const productRoutes = require("./routes/products");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Custom middleware: Request Logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Product routes
app.use("/products", productRoutes);

// 404 Handler for unknown routes
app.use((req, res) => {
  res.status(404).json({
    message: `Cannot ${req.method} ${req.url} - Endpoint not found`,
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Global Error Handler:", err);

  res.status(err.status || 500).json({
    message: err.message || "Something went wrong on the server",
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});