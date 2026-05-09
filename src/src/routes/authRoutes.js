const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

/* REGISTER */
router.post("/register", async (req, res) => {

  try {

    const { email, password, company } = req.body;

    const hash = await bcrypt.hash(password, 10);

    const { data: comp } = await supabase
      .from("companies")
      .insert([{ name: company }])
      .select()
      .single();

    await supabase.from("users").insert([
      {
        email,
        password: hash,
        company_id: comp.id
      }
    ]);

    res.json({ ok: true });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: "Erro register"
    });

  }

});

/* LOGIN */
router.post("/login", async (req, res) => {

  try {

    const { email, password } = req.body;

    const { data } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (!data) {
      return res.status(401).json({
        error: "Usuário não encontrado"
      });
    }

    const ok = await bcrypt.compare(
      password,
      data.password
    );

    if (!ok) {
      return res.status(401).json({
        error: "Senha inválida"
      });
    }

    const token = jwt.sign(
      {
        company_id: data.company_id
      },
      process.env.JWT_SECRET
    );

    res.json({ token });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: "Erro login"
    });

  }

});

module.exports = router;
