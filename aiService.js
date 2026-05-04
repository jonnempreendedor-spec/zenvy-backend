export const generateReply = async (text) => {
  const msg = text.toLowerCase();

  if (msg.includes("agendar")) {
    return "Perfeito! Me fala o melhor dia pra você 😊";
  }

  if (msg.includes("horário")) {
    return "Tenho horários amanhã às 10h e 14h. Qual prefere?";
  }

  if (msg.includes("preço")) {
    return "Me diz qual serviço você quer que te passo o valor certinho 👌";
  }

  return "Me explica melhor que eu te ajudo 😊";
};