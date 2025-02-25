const express = require("express");
const app = express();
const PORT = 4200;
const axios = require("axios");

app.use(express.json());

const servers = ["http://server1:4300", "http://server2:4400", "http://server3:4500"];
let counter = 0;

app.get("/", (req, res) => {
  res.send("Hello from Docker!");
});

app.post("/lb", async (req, res) => {
  try {
    const target = servers[counter % servers.length];
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