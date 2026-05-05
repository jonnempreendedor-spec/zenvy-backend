const express = require("express");
const fetch = require("node-fetch");
require("dotenv").config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

/* ROTA TESTE */
app.get("/", (req, res) => {
  res.send("API rodando 🚀");
});

/* WEBHOOK VERIFY */
app.get("/webhook/whatsapp", (req, res) => {
  const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ Webhook verificado");
    return res.status(200).send(challenge);
  } else {
    return res.sendStatus(403);
  }
});

/* RECEBER MENSAGEM */
app.post("/webhook/whatsapp", async (req, res) => {
  try {
    const message =
      req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    if (!message) return res.sendStatus(200);

    const from = message.from;
    const text = message.text?.body || "";

    console.log("📩", text);

    await enviarMensagem(from, gerarResposta(text));

    res.sendStatus(200);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

/* IA SIMPLES */
function gerarResposta(msg) {
  msg = msg.toLowerCase();

  if (msg.includes("agendar")) {
    return "Perfeito! Me fala um dia e horário 😊";
  }

  return "Entendi! Me conta mais detalhes 👀";
}

/* ENVIAR WHATSAPP */
async function enviarMensagem(to, message) {
  await fetch(
    `https://graph.facebook.com/v18.0/${process.env.PHONE_NUMBER_ID}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: { body: message },
      }),
    }
  );
}

app.listen(PORT, () => console.log("🚀 Rodando na porta", PORT));
