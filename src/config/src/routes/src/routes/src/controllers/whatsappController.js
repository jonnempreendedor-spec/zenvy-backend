const service = require("../services/whatsappService");

exports.handleWebhook = async (req, res) => {
  try {
    await service.processMessage(req.body);
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};
