const amqp = require("amqplib");
const mongoose = require("mongoose");
const Consul = require("consul");
const cors = require("cors");

const consul = new Consul();
const serviceName = "data-aggregator-service";
const serviceId = `${serviceName}-${new Date().getTime()}`;
const port = 3003;

const rabbitMqServer = "amqp://user:password@localhost:5672/";
const queue = "weatherData";

const mongoDbUri = "mongodb://test:1234@localhost:27018/";

mongoose.connect(mongoDbUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const locationSchema = new mongoose.Schema({
  name: String,
  region: String,
  country: String,
  lat: Number,
  lon: Number,
  tz_id: String,
  localtime_epoch: Number,
  localtime: String,
});

const currentWeatherSchema = new mongoose.Schema({
  last_updated_epoch: Number,
  last_updated: String,
  temp_c: Number,
  temp_f: Number,
  is_day: Number,
  condition: {},
  wind_mph: Number,
  wind_kph: Number,
  wind_degree: Number,
  wind_dir: String,
  pressure_mb: Number,
  pressure_in: Number,
  precip_mm: Number,
  precip_in: Number,
  humidity: Number,
  cloud: Number,
  feelslike_c: Number,
  feelslike_f: Number,
  vis_km: Number,
  vis_miles: Number,
  uv: Number,
  gust_mph: Number,
  gust_kph: Number,
});

const mainSchema = new mongoose.Schema({
  id: Number,
  idx: Number,
  name: String,
  lat: Number,
  lng: Number,
  bikes: Number,
  free: Number,
  timestamp: String,
  number: Number,
  weather: {
    location: locationSchema,
    current: currentWeatherSchema,
  },
});

const AggregatedData = mongoose.model("AggregatedData", mainSchema);

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

async function processMessages() {
  const connection = await amqp.connect(rabbitMqServer);
  const channel = await connection.createChannel();
  await channel.assertQueue(queue, { durable: false });

  channel.consume(queue, async (msg) => {
    if (msg) {
      try {
        console.log("Received data:", msg.content.toString());
        const data = JSON.parse(msg.content.toString());

        const existingRecord = await AggregatedData.findOne({ id: data.id });

        if (existingRecord) {
          await AggregatedData.updateOne({ id: data.id }, data);
          console.log(`Updated record for id: ${data.id}`);
        } else {
          
          const aggregatedData = new AggregatedData(data);
          await aggregatedData.save();
          console.log(`Created new record for id: ${data.id}`);
        }

        channel.ack(msg);
      } catch (error) {
        console.log(error);
        channel.ack(msg);
      }
    }
  });
}

processMessages();

const express = require("express");
const app = express();

app.get("/health", (req, res) => res.sendStatus(200));

app.use(cors());

app.get("/data", async (req, res) => {
  try {
    const data = await AggregatedData.find({});
    res.json(data);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.listen(port, () => {
  console.log(`DataAggregatorService listening on port ${port}`);
});
