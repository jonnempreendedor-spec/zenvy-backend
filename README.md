# zenvy-backend

Backend do Zenvy AI
/package.json
/index.js

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

import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Zenvy API online 🚀");
});

app.post("/ai", (req, res) => {
  const { message } = req.body;

  res.json({
    reply: "IA respondeu: " + message
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
