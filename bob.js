import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ mgs: "bem vindo a nossa API" });
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
