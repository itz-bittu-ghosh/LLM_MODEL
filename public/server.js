// const express = require('express')
import express from "express";
import  {main}  from "./chatBot.js";
import cors from "cors"

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.post("/chat", async (req, res) => {
  // res.send('Hello World!')
  const { message } = req.body;
  const LLM_Responds = await main(message);
  res.json({ response: LLM_Responds });

  // console.log("message: ", LLM_Responds);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
