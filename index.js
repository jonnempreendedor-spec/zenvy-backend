require("dotenv").config();

const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { createClient } = require("@supabase/supabase-js");

const app = express();
app.use(cors());
app.use(express.json());

/* =========================
   SUPABASE
========================= */
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

/* =========================
   REGISTER
========================= */
app.post("/register", async (req, res) => {
  try {
    const { email, password, company } = req.body;

    const hash = await bcrypt.hash(password, 10);

    const { data: comp, error: compError } = await supabase
      .from("companies")
      .insert([{ name: company }])
      .select()
      .single();

    if (compError) throw compError;

    const { error: userError } = await supabase.from("users").insert([
      {
        email,
        password: hash,
        company_id: comp.id
      }
    ]);

    if (userError) throw userError;

    res.json({ ok: true });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ error: "Erro ao registrar" });
  }
});

/* =========================
   LOGIN
========================= */
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !data) return res.sendStatus(401);

    const ok = await bcrypt.compare(password, data.password);
    if (!ok) return res.sendStatus(401);

    const token = jwt.sign(
      { company_id: data.company_id },
      process.env.JWT_SECRET
    );

    res.json({ token });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ error: "Erro no login" });
  }
});

/* =========================
   AUTH
========================= */
function auth(req, res, next) {
  const token = req.headers.authorization;
  if (!token) return res.sendStatus(401);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.company_id = decoded.company_id;
    next();
  } catch {
    res.sendStatus(401);
  }
}

/* =========================
   DASHBOARD
========================= */
app.get("/dashboard", auth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("company_id", req.company_id);

    if (error) throw error;

    res.json({ total: data.length });
  } catch (err) {
    console.error("DASHBOARD ERROR:", err);
    res.status(500).json({ error: "Erro ao carregar dashboard" });
  }
});

/* =========================
   WEBHOOK WHATSAPP
========================= */
app.post("/webhook/whatsapp", async (req, res) => {
  try {
    const msg =
      req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    if (!msg) return res.sendStatus(200);

    const from = msg.from;
    const text = msg.text?.body || "";

    /* 🔥 PEGA EMPRESA DO .ENV */
    const company_id = process.env.DEFAULT_COMPANY_ID;

    if (!company_id) {
      console.error("FALTA DEFAULT_COMPANY_ID no .env");
      return res.sendStatus(500);
    }

    /* 🔒 LIMITADOR (ANTI QUEBRA) */
    const { count } = await supabase
      .from("messages")
      .select("*", { count: "exact", head: true })
      .eq("company_id", company_id);

    if (count > 1000) {
      console.log("Limite atingido");
      return res.sendStatus(200);
    }

    /* 💾 SALVAR MENSAGEM RECEBIDA */
    await supabase.from("messages").insert([
      {
        company_id,
        phone: from,
        message: text,
        from_me: false
      }
    ]);

    /* 🧲 CRIAR / ATUALIZAR LEAD */
    await supabase.from("leads").upsert([
      {
        company_id,
        phone: from,
        last_interaction: new Date()
      }
    ]);

    /* 🤖 GERAR RESPOSTA */
    const resposta = gerarResposta(text);

    /* 💾 SALVAR RESPOSTA */
    await supabase.from("messages").insert([
      {
        company_id,
        phone: from,
        message: resposta,
        from_me: true
      }
    ]);

    /* 📤 ENVIAR WHATSAPP */
    await fetch(
      `https://graph.facebook.com/v18.0/${process.env.PHONE_NUMBER_ID}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: from,
          type: "text",
          text: { body: resposta }
        })
      }
    );

    res.sendStatus(200);
  } catch (err) {
    console.error("WEBHOOK ERROR:", err);
    res.sendStatus(500);
  }
});

/* =========================
   IA SIMPLES (MELHORADA)
========================= */
function gerarResposta(msg) {
  msg = msg.toLowerCase();

  if (msg.includes("preço") || msg.includes("valor")) {
    return "Hoje temos condição especial 🔥 quer saber como funciona?";
  }

  if (msg.includes("agendar")) {
    return "Perfeito! Qual horário você prefere?";
  }

  if (msg.includes("não")) {
    return "Sem problema 😊 posso te explicar rapidinho";
  }

  return "Entendi 👀 me conta melhor o que você procura";
}

/* =========================
   TESTE
========================= */
app.get("/", (req, res) => {
  res.send("🚀 API rodando 100%");
});

/* =========================
   ERRO GLOBAL
========================= */
app.use((err, req, res, next) => {
  console.error("ERRO GLOBAL:", err);
  res.status(500).json({ error: "Erro interno" });
});

/* =========================
   START
========================= */
app.listen(process.env.PORT, () => {
  console.log("🔥 Servidor 100% ON");
});
