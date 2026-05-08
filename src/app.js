const express = require("express");
const cors = require("cors");

const webhookRoutes = require("./routes/webhookRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/webhook", webhookRoutes);

app.get("/", (req, res) => {
  res.send("🚀 API rodando 100%");
});

module.exports = app;
