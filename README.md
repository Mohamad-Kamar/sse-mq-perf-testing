# SSE-MQ Performance Testing

This project aims to test the performance of various messaging queue systems, including SSE-MQ, Kafka, and RabbitMQ, using a specific set of criteria.

## Prerequisites

1. Node.js (v14.x or later)
2. Docker

## Configuration

To test different messaging queues, update the `MESSAGE_QUEUE` constant in `config.js`. Supported values are:

- 'ssemq'
- 'kafka'
- 'rabbitmq'

## Setup

1. Clone the repository: `git clone https://github.com/Mohamad-Kamar/sse-mq-perf-testing.git`
2. Enter the project directory: `cd sse-mq-perf-testing`
3. Install dependencies: `npm install`
4. Start the Docker containers for the messaging queues:

```docker-compose up -d```

If you want to start only specific messaging queue services, you can use one of the following commands:

- SSE-MQ: `docker-compose up -d sse-mq`
- Kafka: `docker-compose up -d kafka zookeeper`
- RabbitMQ: `docker-compose up -d rabbitmq`

## Running the Tests

To run the performance test, use the following command:

```npm start```

This will execute the `index.js` file, which contains the main testing logic.

The test results will be displayed on the console, displaying the time taken for message creation and consumption, as well as the average time for message processing.

To test different queues from the start command without changing the config file, use the command:

```npm run start:<your-queue-name>```

## Cleaning Up

To stop and remove the Docker containers after testing, run:

```docker-compose down```

## Contributing

If you would like to contribute to this project, please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.