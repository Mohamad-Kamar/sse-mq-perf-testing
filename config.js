import SSEMQAdapter from './messageQueueAdapters/sseMQAdapter.js';
import RabbitMQAdapter from './messageQueueAdapters/rabbitMQAdapter.js';
import KafkaAdapter from './messageQueueAdapters/kafkaAdapter.js';

const MESSAGE_QUEUE = 'ssemq'; // Change this value to switch between different adapters.

const rabbitMQConfig = {
  url: 'amqp://localhost',
};

const kafkaConfig = {
  clientId: 'your-client-id',
  brokers: ['localhost:9092'],
};

const sseMQConfig = {
  baseUrl: 'http://localhost:3491',
};

const adapters = {
  ssemq: new SSEMQAdapter(sseMQConfig.baseUrl),
  rabbitmq: new RabbitMQAdapter(rabbitMQConfig.url),
  kafka: new KafkaAdapter(kafkaConfig),
};

export const adapter = adapters[MESSAGE_QUEUE];
