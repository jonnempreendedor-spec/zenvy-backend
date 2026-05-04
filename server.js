import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

/* =========================
   WEBHOOK VERIFICATION (META)
========================= */
app.get("/webhook/whatsapp", (req, res) => {
  const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token === VERIFY_TOKEN) {
    console.log("✅ Webhook verificado");
    return res.status(200).send(challenge);
  } else {
    return res.sendStatus(403);
  }
});

/* =========================
   RECEBER MENSAGEM
========================= */
app.post("/webhook/whatsapp", async (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const message = changes?.value?.messages?.[0];

    if (!message) {
      return res.sendStatus(200);
    }

    const from = message.from;
    const text = message.text?.body;

    console.log("📩 Mensagem recebida:", text);

    // 🔥 RESPOSTA IA (simples por enquanto)
    let reply = gerarRespostaIA(text);

    await enviarMensagem(from, reply);

    res.sendStatus(200);
  } catch (err) {
    console.error("❌ Erro:", err);
    res.sendStatus(500);
  }
});

/* =========================
   IA SIMPLES (DEPOIS VOCÊ EVOLUI)
========================= */
function gerarRespostaIA(text) {
  if (!text) return "Oi! Como posso te ajudar?";

  text = text.toLowerCase();

  if (text.includes("agendar")) {
    return "Perfeito! Me fala um dia e horário que você prefere 😊";
  }

  if (text.includes("preço")) {
    return "Vou te explicar certinho os valores 😉";
  }

  return "Entendi 😊 Me conta mais detalhes pra eu te ajudar melhor!";
}

/* =========================
   ENVIAR MENSAGEM WHATSAPP
========================= */
async function enviarMensagem(to, message) {
  const url = `https://graph.facebook.com/v18.0/${process.env.PHONE_NUMBER_ID}/messages`;

  await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: to,
      type: "text",
      text: { body: message },
    }),
  });
}

/* =========================
   START
========================= */
app.listen(PORT, () => {
  console.log("🚀 Servidor rodando na porta", PORT);
});
