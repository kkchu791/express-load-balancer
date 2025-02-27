const express = require("express");
const app = express();
const PORT = 4200;
const axios = require("axios");
const Registry = require('./registry');

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello from Docker!");
});

let counter = 0;

app.post("/lb", async (req, res) => {
  try {
    const registry = new Registry()
    const allActiveServers = registry.getAllActiveServerUrls();
    const target = allActiveServers[counter % allActiveServers.length];
    counter++;
    console.log(`Forwarding request to: ${target}`);

    const response = await axios.post(`${target}/receive`, req.body);

    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Error forwarding request:", error.message);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});