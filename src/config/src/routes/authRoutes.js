const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const supabase = require("../config/supabase");

const router = express.Router();

router.post("/register", async (req, res) => {
  const { email, password, company } = req.body;

  const hash = await bcrypt.hash(password, 10);

  const { data: comp } = await supabase
    .from("companies")
    .insert([{ name: company }])
    .select()
    .single();

  await supabase.from("users").insert([
    { email, password: hash, company_id: comp.id }
  ]);

  res.json({ ok: true });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const { data } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (!data) return res.sendStatus(401);

  const ok = await bcrypt.compare(password, data.password);
  if (!ok) return res.sendStatus(401);

  const token = jwt.sign(
    { company_id: data.company_id },
    process.env.JWT_SECRET
  );

  res.json({ token });
});

module.exports = router;
