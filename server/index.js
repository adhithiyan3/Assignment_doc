const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const documentRoutes = require("./routes/documents");
const { errorHandler } = require("./middleware/errorHandler");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/documents", documentRoutes);
app.get("/", (req, res) => res.send("API is running..."));

// Error Handler
app.use(errorHandler);


const PORT = process.env.PORT || 5000;


app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
