const express = require("express");

const router = express.Router();

/* VERIFY */
router.get("/whatsapp", (req, res) => {
  res.send("Webhook funcionando 🚀");
});

/* RECEIVE */
router.post("/whatsapp", async (req, res) => {
  console.log("📩 Mensagem recebida");

  res.sendStatus(200);
});

module.exports = router;
