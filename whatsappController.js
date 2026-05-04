import { saveMessage, getMessagesByUser } from "../models/message.js";
import { generateReply } from "../services/aiService.js";
import { sendWhatsAppMessage } from "../services/whatsappService.js";

export const verifyWebhook = (req, res) => {
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (token === process.env.VERIFY_TOKEN) {
    return res.send(challenge);
  }

  return res.sendStatus(403);
};

export const receiveWebhook = async (req, res) => {
  try {
    const msg = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    if (!msg) return res.sendStatus(200);

    const from = msg.from;
    const text = msg.text?.body || "";

    await saveMessage({ from, text, role: "user" });

    const history = await getMessagesByUser(from);

    const reply = await generateReply(text, history);

    await saveMessage({ from, text: reply, role: "assistant" });

    await sendWhatsAppMessage(from, reply);

    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};