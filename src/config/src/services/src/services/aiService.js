module.exports = function (msg) {
  msg = msg.toLowerCase();

  if (msg.includes("preço")) {
    return "Temos uma condição especial 🔥 quer detalhes?";
  }

  if (msg.includes("agendar")) {
    return "Qual horário você prefere?";
  }

  return "Me conta melhor o que você precisa 👀";
};
