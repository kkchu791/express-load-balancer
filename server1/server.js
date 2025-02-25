const express = require("express");
const app = express();
const PORT = 4300;

app.use(express.json());

app.post("/receive", (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  console.log(`Received message on Server 1: ${message}`);
  res.json({ status: "Message received", received: message });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server 1 listening on port ${PORT}`);
});