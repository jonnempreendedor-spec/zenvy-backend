const express = require("express");
const fetch = require("node-fetch");
require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

/* SUPABASE */
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

/* TESTE */
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
    return res.status(200).send(challenge);
  } else {
    return res.sendStatus(403);
  }
});

/* WEBHOOK RECEBER MENSAGEM */
app.post("/webhook/whatsapp", async (req, res) => {
  try {
    const message =
      req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    if (!message) return res.sendStatus(200);

    const from = message.from;
    const text = message.text?.body || "";

    console.log("📩 Mensagem recebida:", text);

    /* 🔥 SALVAR NO BANCO */
    await supabase.from("messages").insert([
      {
        phone: from,
        message: text,
        from_me: false,
      },
    ]);

    /* IA SIMPLES */
    const resposta = gerarResposta(text);

    /* ENVIAR RESPOSTA */
    await enviarMensagem(from, resposta);

    res.sendStatus(200);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

/* GERAR RESPOSTA IA */
function gerarResposta(msg) {
  msg = msg.toLowerCase();

  if (msg.includes("agendar")) {
    return "Perfeito! Me fala o melhor horário 😊";
  }

  return "Entendi! Me conta mais 👀";
}

/* ENVIAR WHATSAPP */
async function enviarMensagem(to, message) {
  /* SALVAR MENSAGEM ENVIADA */
  await supabase.from("messages").insert([
    {
      phone: to,
      message: message,
      from_me: true,
    },
  ]);

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

/* BUSCAR MENSAGENS */
app.get("/messages/:phone", async (req, res) => {
  const { phone } = req.params;

  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("phone", phone)
    .order("created_at", { ascending: true });

  if (error) return res.status(500).json(error);

  res.json(data);
});

app.listen(PORT, () => console.log("🚀 Rodando na porta", PORT));
