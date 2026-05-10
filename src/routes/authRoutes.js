const express = require("express");

const router = express.Router();

/* =========================
   LOGIN
========================= */
router.post("/login", async (req, res) => {

  try {

    const { email, password } = req.body;

    if (
      email === "admin@zenvy.com" &&
      password === "123456"
    ) {

      return res.json({
        token: "TOKEN_TESTE_ZENVY"
      });

    }

    return res.status(401).json({
      error: "Login inválido"
    });

  } catch (err) {

    console.log(err);

    return res.status(500).json({
      error: "Erro servidor"
    });

  }

});

/* =========================
   REGISTER
========================= */
router.post("/register", async (req, res) => {

  try {

    return res.json({
      ok: true,
      message: "Usuário criado"
    });

  } catch (err) {

    return res.status(500).json({
      error: "Erro register"
    });

  }

});

module.exports = router;
