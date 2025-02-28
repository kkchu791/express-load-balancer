const express = require("express");
const app = express();
const PORT = 4200;
const axios = require("axios");
const registryInstance = require('./registry');

app.use(express.json());

app.use((req, res, next) => {
  req.realIP = req.ip.includes('::ffff:') ? req.ip.split('::ffff:')[1] : req.ip;
  next();
});  

app.get("/", (req, res) => {
  res.send("Hello from Docker!");
});

setInterval(async () => {
  await getServerHealth();
}, 10000);

const getServerHealth = async () => {
  const servers = registryInstance.getAllServers();

  Object.entries(servers).forEach(async ([server, serverData]) => {
    const serverHealthUrl = `http://${serverData['ip_address']}:${serverData['port']}/health`;

    let response;
    try {
      response = await axios.get(`${serverHealthUrl}`);
    } catch (error) {
      console.error("Server is unreachable:", error.message)
      response = {status: 503};
    }

    if (response.status === 200) {
      registryInstance.resetFailureCount(server);
    } else if (serverData['failure_count'] >= 3) {
      registryInstance.deregisterServer(server);
    } else {
      registryInstance.incrementFailureCount(server);
    }
  });
}


app.post("/lb", async (req, res) => {
  try {
    let counter = 0;
    const allActiveServers = registryInstance.getAllActiveServerUrls();
    const target = allActiveServers[counter % allActiveServers.length];
    counter++;
    console.log(`Forwarding request to: ${target}`);

    const response = await axios.post(`${target}/receive`, req.body);

    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Error forwarding request:", error.message);
  }
});

app.get("/receive", (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }
  
    console.log(`Received message: ${message}`);
    res.json({ status: "Message received", received: message });
  } catch (error) {
    console.error("Error forwarding request:", error.message);
  }
  
});

app.post("/register", (req, res) => {
  try {
    const isRegistered = registryInstance.register(req.realIP);

    if (isRegistered) {
      res.json({ status: "Server registered" });
    } else {
      res.json({ status: "Server unregistered"});
    }
  } catch (error) {
    console.error("Error forwarding request:", error.message);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});