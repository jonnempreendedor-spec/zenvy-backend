const supabase = require("../config/supabase");
const fetch = require("node-fetch");
const gerarResposta = require("./aiService");

exports.processMessage = async (body) => {
  const msg =
    body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

  if (!msg) return;

  const from = msg.from;
  const text = msg.text?.body || "";

  const company_id = process.env.DEFAULT_COMPANY_ID;

  await supabase.from("messages").insert([
    { company_id, phone: from, message: text, from_me: false }
  ]);

  await supabase.from("leads").upsert([
    { company_id, phone: from, last_interaction: new Date() }
  ]);

  const resposta = gerarResposta(text);

  await supabase.from("messages").insert([
    { company_id, phone: from, message: resposta, from_me: true }
  ]);

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
};
