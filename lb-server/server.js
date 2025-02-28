const express = require("express");
const app = express();
const PORT = 4200;
const axios = require("axios");
const registryInstance = require('./registry');
const proxy = require('express-http-proxy');

app.use(express.json());

app.use((req, res, next) => {
  req.realIP = req.ip.includes('::ffff:') ? req.ip.split('::ffff:')[1] : req.ip;
  next();
});  

let counter = 0;
app.use('/', (req, res, next) => {
  const allActiveServers = registryInstance.getAllActiveServerUrls();
  const target = allActiveServers[counter % allActiveServers.length];
  const fullUrl = target + req.originalUrl
  counter++;

  if (fullUrl) {
    proxy(fullUrl)(req, res, next);
    next();
  }
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