const axios = require("axios");
const amqp = require("amqplib");
const Consul = require("consul");
const cron = require("node-cron");
const dotenv = require("dotenv").config();

const consul = new Consul();
const serviceName = "bike-service";
const serviceId = `${serviceName}-${new Date().getTime()}`;
const port = 3001;

const rabbitMqServer = "amqp://user:password@localhost:5672/";
const queue = "bikeData";

consul.agent.service.register(
  {
    id: serviceId,
    name: serviceName,
    address: "localhost",
    port: port,
    check: {
      http: `http://localhost:${port}/health`,
      interval: "10s",
    },
  },
  (err) => {
    if (err) throw new Error(err);
    console.log(`Registered ${serviceName} with Consul`);
  }
);

async function sendToQueue(data) {
  const connection = await amqp.connect(rabbitMqServer);
  const channel = await connection.createChannel();
  await channel.assertQueue(queue, { durable: false });
  data.forEach((element) => {
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(element)));
  });
  console.log("Sent bike data to RabbitMQ:", data);
  await channel.close();
  await connection.close();
}

async function fetchBikeData() {
  const options = {
    method: "GET",
    url: "https://community-citybikes.p.rapidapi.com/valenbisi.json",
    headers: {
      "X-RapidAPI-Key": "55b9428979msh2c610d7d918a479p1bb31cjsn17185a2a2552",
      "X-RapidAPI-Host": "community-citybikes.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    console.log(response.data);

    return response.data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

cron.schedule("*/1 * * * *", async () => {
  console.log("Cron");
  console.log("Fetching bike data...");
  const data = await fetchBikeData();
  await sendToQueue(data);
});

const express = require("express");
const app = express();

app.get("/health", (req, res) => res.sendStatus(200));

app.listen(port, () => {
  console.log(`BikeService listening on port ${port}`);
});
