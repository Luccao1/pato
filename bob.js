import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "./models/usuariomodels.js";
import { ReturnDocument } from "mongodb";
dotenv.config();

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ mgs: "bem vindo a nossa API" });
});

app.post("/auth/register", async (req, res) => {
  const { name, email, password, confirmpassword } = req.body;

  if (!name) {
    return res.status(422).json({ msg: "o nome é obrigatorio!" });
  }

  if (!email) {
    return res.status(422).json({ msg: "o email é obrigatorio!" });
  }

  if (!password) {
    return res.status(422).json({ msg: "o senha é obrigatorio!" });
  }

  if (password != confirmpassword) {
    return res
      .status(422)
      .json({ msg: "A senha e a confimacão precisa ser iguais" });
  }

  const userExists = await User.findOne({ email: email });

  if (userExists) {
    return res.status(422).json({ msg: "por favor , utilize outro e-mail" });
  }

  const salt = await bcrypt.genSalt(12);
  const passwordhast = await bcrypt.hash(password, salt);

  const user = new User({
    name,
    email,
    passwordhast,
  });

  try {
    await user.save();

    res.status(201).json({ msg: "usuario criado com sucesso" });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
});

app.post("/auth/login", async (req, res) => {
  const { email, password} = req.body;

  if (!email) {
    return res.status(422).json({msg: "O email deve ser informado!"});
  }

  if (!password) {
    return res.status(422).json({msg: "O senha deve ser informado!"});
  }

const user = await User.findOne({ email: email });

if (!user) {
  return res.status(404).json({msg: "usuario nao encontrado!"});
}

const checkPassword = await bcrypt.compare(password, User.password);

  if (!checkPassword) {
    return res.status(422).json({msg: "senha invalida, tente novamente."});
  }

try {
  const secret = process.env.SECRET;

  const token = jwt.sign(
    {
      id: user._id,
    },
    secret
  );

  res.status(200).json({msg: "autenticacao realizada com sucesso!", token});
} catch (error) {
  res.status(500).json({msg: error});
}

});

const dbUser = process.env.DB_USER;
const dbpassword = process.env.DB_PASS;

mongoose
  .connect(
    `mongodb+srv://${dbUser}:${dbpassword}@kick.yobbb.mongodb.net/?retryWrites=true&w=majority&appName=kick`
  )
  .then(() => {
    app.listen(3000);
    console.log("conectou ao banco");
  })
  .catch((err) => console.log(err));
