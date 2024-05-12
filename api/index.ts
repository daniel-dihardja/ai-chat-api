const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware to parse JSON bodies
app.use(express.json());

app.get("/", (req, res) => {
  res.send("ai chat proxy");
});

app.post("/api/v1/toolchat", async (req, res) => {
  const message = req.body.message;
  if (!message) {
    return res.status(400).send("Missing message");
  }
  const chatId = req.body.chatId;
  const url = `${process.env.FLOWISE_URL}/${process.env.TOOL_CHAT_ID}`;
  res.send(await postQuestion(url, { question: message, chatId }));
});

app.post("/api/v1/docchat", async (req, res) => {
  const message = req.body.message;
  if (!message) {
    return res.status(400).send("Missing message");
  }
  const chatId = req.body.chatId;
  const url = `${process.env.FLOWISE_URL}/${process.env.DOC_CHAT_ID}`;
  res.send(await postQuestion(url, { question: message, chatId }));
});

async function postQuestion(
  url: string,
  body: { question: string; chatId?: string }
) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return await response.json();
}

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app;
