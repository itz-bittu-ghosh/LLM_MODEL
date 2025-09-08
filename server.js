// const express = require('express')
import express from "express";
import  {main}  from "./chatBot.js";
import cors from "cors"
import "dotenv/config";

const app = express();
const PORT = process.env.PORT || 3004;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())
app.use(express.static("public"));

app.post("/chat", async (req, res) => {
  // res.send('Hello World!')
  const { message } = req.body;
  const LLM_Responds = await main(message);
  res.json({ response: LLM_Responds });

  // console.log("message: ", LLM_Responds);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at: http://localhost:${PORT}`);

});
