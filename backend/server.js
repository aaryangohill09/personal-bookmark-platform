const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

let mongoConnection;

async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  if (!mongoConnection) {
    mongoConnection = mongoose.connect(process.env.MONGO_URI);
  }

  await mongoConnection;
  console.log("MongoDB connected");
}

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.log("MongoDB connection error:", error.message);

    res.status(500).json({
      message: "Database connection failed"
    });
  }
});

app.use("/api/auth", require("./routes/auth"));
app.use("/api/bookmarks", require("./routes/bookmarks"));
app.use("/api/collections", require("./routes/collections"));

app.use(express.static(path.join(__dirname, "..")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "index.html"));
});

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;

