const express = require("express");

const router = express.Router();

const controller = require(
  "../controllers/whatsappController"
);

/* WEBHOOK */
router.post(
  "/whatsapp",
  controller.handleWebhook
);

module.exports = router;
