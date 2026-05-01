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

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log("Server running")
})

package.json
{
  "name": "zenvy-api",
  "version": "1.0.0",
  "main": "index.js",
  "type": "module",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5"
  }
}
