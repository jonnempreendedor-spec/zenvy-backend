# zenvy-backend
Backend do Zenvy AI
index.js
const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log("Server running")
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
package.json
{
  "name": "zenvy-api",
  "version": "1.0.0",
  "main": "index.js",
  "type": "module",
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5"
  }
}
