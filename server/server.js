const express = require("express");
const app = express();
const PORT = 80;
const axios = require("axios");
const os = require('os');
require('dotenv').config();

app.use(express.json());

const selfRegisterWithLoadBalancer = async () => {
  try {
    const response = await axios.post(`${process.env.LOAD_BALANCER_URL}/register`);
  } catch (e) {
    console.error("Self-register: Error forwarding register request:", e.message);
  }
};

setTimeout(async () => {
  await selfRegisterWithLoadBalancer();
}, 1000);


app.get("/health", (req, res) => {
  res.status(200).json({status_message: 'OK'});
});

app.post("/receive", (req, res) => {
  try {
    const { message } = req.body;
    
    console.log(message, 'message')
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }
  
    console.log(`Received message: ${message}`);
    res.json({ status: "Message received", received: message });
  } catch (e) {
    console.log(e, 'error')
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server 1 listening on port ${PORT}`);
});