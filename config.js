import SSEMQAdapter from './messageQueueAdapters/sseMQAdapter.js';
import RabbitMQAdapter from './messageQueueAdapters/rabbitMQAdapter.js';
import KafkaAdapter from './messageQueueAdapters/kafkaAdapter.js';

// const MESSAGE_QUEUE = 'ssemq'; // Change this value to switch between different adapters.
// const MESSAGE_QUEUE = 'rabbitmq';
const MESSAGE_QUEUE = 'kafka';

const rabbitMQConfig = {
  url: 'amqp://localhost:5672',
};

const kafkaConfig = {
  clientId: 'sse-mq-perf-test',
  brokers: ['localhost:9092'],
};

const sseMQConfig = {
  baseUrl: 'http://localhost:3491',
};

const adapters = {
  // ssemq: new SSEMQAdapter(sseMQConfig.baseUrl),
  // rabbitmq: new RabbitMQAdapter(rabbitMQConfig.url),
  kafka: new KafkaAdapter(kafkaConfig),
};

const adapter = adapters[MESSAGE_QUEUE];
await adapter.init();
export { adapter };
