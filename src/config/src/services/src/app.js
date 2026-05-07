const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const webhookRoutes = require("./routes/webhookRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/", authRoutes);
app.use("/webhook", webhookRoutes);

app.get("/", (req, res) => {
  res.send("API rodando 🚀");
});

module.exports = app;
