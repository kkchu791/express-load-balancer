const express = require("express");
const app = express();
const PORT = 4300;

app.use(express.json());

app.get("/health", (req, res) => {
  console.log(200, 'ok')
  res.status(200).send('OK');
});

app.post("/receive", (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  console.log(`Received message: ${message}`);
  res.json({ status: "Message received", received: message });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server 1 listening on port ${PORT}`);
});