const express = require("express");
const router = express.Router();

router.post("/login", async (req, res) => {

  try {

    const { email, password } = req.body;

    if (
      email === "admin@zenvy.com" &&
      password === "123456"
    ) {

      return res.json({
        token: "TOKEN_TESTE"
      });

    }

    res.status(401).json({
      error: "Login inválido"
    });

  } catch (err) {

    res.status(500).json({
      error: "Erro servidor"
    });

  }

});

module.exports = router;
