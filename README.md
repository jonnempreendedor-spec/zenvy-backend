# zenvy-backend

Backend do Zenvy AI

#index.js
{
import express from "express"
import express from "express"
import cors from "cors"

const app = express()

app.use(cors())
app.use(express.json())

// rota teste
app.get("/", (req, res) => {
  res.send("Zenvy API online 🚀")
})

// rota principal da IA
app.post("/ai", (req, res) => {
  const { message } = req.body

  if (!message) {
    return res.status(400).json({
      error: "Envie uma mensagem"
    })
  }

  // resposta simples (você depois conecta IA aqui)
  return res.json({
    reply: `Zenvy recebeu: ${message}`
  })
})

// porta do Render
const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT)
})

#package.json
{
  "name": "zenvy-api",
  "version": "1.0.0",
  "type": "module",
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5"
  }
}
