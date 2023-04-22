import SSEMQAdapter from './messageQueueAdapters/sseMQAdapter';
import RabbitMQAdapter from './messageQueueAdapters/rabbitMQAdapter';
import KafkaAdapter from './messageQueueAdapters/kafkaAdapter';

const MESSAGE_QUEUE = 'rabbitmq'; // Change this value to switch between different adapters.

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
