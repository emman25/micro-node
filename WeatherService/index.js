const axios = require('axios');
const amqp = require('amqplib');
const Consul = require('consul');

const consul = new Consul({
  host: 'consul'
});
const serviceName = "weather-service";
const serviceId = `${serviceName}-${new Date().getTime()}`; 
const port = 3002; 

const rabbitMqServer = 'amqp://user:password@rabbitmq:5672/';
const receiveQueue = 'bikeData';
const sendQueue = 'weatherData';


consul.agent.service.register({
  id: serviceId,
  name: serviceName,
  address: serviceName,
  port: port,
  check: {
    http: `http://${serviceName}:${port}/health`,
    interval: '10s'
  }
}, err => {
  if (err) throw new Error(err);
  console.log(`Registered ${serviceName} with Consul`);
});

// Function to fetch weather data
async function fetchWeatherData(location) {

  const options = {
    method: 'GET',
    url: 'https://weatherapi-com.p.rapidapi.com/current.json',
    params: {q: `${location.lat},${location.lng}`},
    headers: {
      'X-RapidAPI-Key': '55b9428979msh2c610d7d918a479p1bb31cjsn17185a2a2552',
      'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com'
    }
  };

  try {
    const response = await axios.request(options);
    console.log(response.data);

    return response.data
  } catch (error) {
    console.error(error);

    return []
  }
}


async function sendToQueue(data) {
  const connection = await amqp.connect(rabbitMqServer);
  const channel = await connection.createChannel();
  await channel.assertQueue(sendQueue, { durable: false });
  channel.sendToQueue(sendQueue, Buffer.from(JSON.stringify(data)));
  console.log("Sent weather data to RabbitMQ:", data);
  await channel.close();
  await connection.close();
}

async function processMessages() {
  const connection = await amqp.connect(rabbitMqServer);
  const channel = await connection.createChannel();
  await channel.assertQueue(receiveQueue, { durable: false });

  channel.consume(receiveQueue, async (msg) => {
    if (msg) {
      console.log("Received bike data:", msg.content.toString());
      const bikeData = JSON.parse(msg.content.toString());
      const weatherData = await fetchWeatherData({lat: bikeData.lat, lng: bikeData.lng });
      const combinedData = { ...bikeData, weather: weatherData };
      await sendToQueue(combinedData);
      channel.ack(msg);
    }
  });
}


const express = require('express');
const app = express();

app.get('/health', (req, res) => {
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`WeatherService listening on port ${port}`);
  processMessages();
});
