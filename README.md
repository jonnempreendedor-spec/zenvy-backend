# zenvy-backend
Backend do Zenvy AI
index.js
import express from "express"
import cors from "cors"

const app = express()
app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
  res.send("Zenvy API online 🚀")
})

app.post("/ai", async (req, res) => {
  const { message } = req.body

  res.json({
    reply: "IA respondeu: " + message
  })
})

app.listen(3000, () => {
  console.log("Server running")
})
