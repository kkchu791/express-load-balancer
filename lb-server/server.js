const express = require("express");
const app = express();
const PORT = 4200;
const axios = require("axios");
const registryInstance = require('./registry');

app.use(express.json());

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

    console.log(serverData, 'serverData')
    if (response.status === 200) {
      console.log("reset")
      registryInstance.resetFailureCount(server);
    } else if (serverData['failure_count'] >= 3) {
      console.log("deregister")
      registryInstance.deregisterServer(server);
    } else {
      console.log("incrementFailureCount")
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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});