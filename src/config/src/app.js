const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const webhookRoutes = require("./routes/webhookRoutes");

const app = express();

app.use(cors());
app.use(express.json());

/* ROTAS */
app.use("/", authRoutes);
app.use("/webhook", webhookRoutes);

/* TESTE */
app.get("/", (req, res) => {
  res.send("🚀 Zenvy AI Backend Online");
});

module.exports = app;
