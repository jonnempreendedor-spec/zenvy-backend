require("dotenv").config();

const app = require("./src/app");

/* =========================
   START SERVER
========================= */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`
🚀 ==============================
🔥 ZENVY AI BACKEND ONLINE
🌍 Porta: ${PORT}
⚡ Ambiente: PRODUÇÃO
==============================
`);
});
