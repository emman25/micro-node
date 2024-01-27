
# Bike and Weather Data Aggregator Project

This project demonstrates the integration of two different APIs: a Bike information API and the WeatherAPI, to aggregate and display data related to bike models and corresponding weather conditions.

## Prerequisites
- Create a repository on a platform of your choice (GitHub, GitLab, etc.) to push your work. The repository should be public.
- Sign up for a free account at [RapidAPI](https://rapidapi.com/).

## Getting Started
After completing the prerequisites, select two APIs from the RapidAPI platform. These APIs should be free to use and complement each other for data aggregation. For example, you might choose an API providing bike information and another for weather data.

**Note**: Be mindful of the API usage limits to avoid exhausting your free calls.

## Project Requirements
- **NodeJS REST API Service**
- **API Integration**: Integrate two different APIs for data aggregation.
- **Runtime Data Aggregation**
- **Documentation**
- **Code Commenting**
- **ESLinting**
- **Postman Collection**

Bonus
- **MongoDB**
- **Microservices Architecture**
- **Messaging Queue**
- **Cron Jobs**
- **ReactJS**
- **Dockerization**

## Integration Example: Bike Information & Weather Data
For this project, integrate a Bike information API and WeatherAPI from RapidAPI. Use MongoDB, RabbitMQ, and Consul for data management and service discovery.

## Running the Services with Docker
### Start the Docker Environment
```bash
docker compose up -d
```

### Run Bike Service
Navigate to the BikeService directory and start the service:
```bash
cd BikeService
npm run start
```

### Run Weather Service
Navigate to the WeatherService directory and start the service:
```bash
cd WeatherService
npm run start
```

### Run Data Aggregator Service
Navigate to the DataAggregatorService directory and start the service:
```bash
cd DataAggregatorService
npm run start
```

### Run BikeWeather Dashboard
Navigate to the BikeWeatherDashboard directory and start the dashboard:
```bash
cd BikeWeatherDashboard
npm run start
```
