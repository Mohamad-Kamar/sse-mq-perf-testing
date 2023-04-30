import SSEMQAdapter from './messageQueueAdapters/sseMQAdapter';
import RabbitMQAdapter from './messageQueueAdapters/rabbitMQAdapter';
import KafkaAdapter from './messageQueueAdapters/kafkaAdapter';
import { MessagesOrchestrator } from './MessagesOrchestrator';

const MESSAGE_QUEUE = 'ssemq'; // Change this value to switch between different adapters.
const messageOrc = new MessagesOrchestrator();

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
  ssemq: new SSEMQAdapter(sseMQConfig.baseUrl, messageOrc),
  rabbitmq: new RabbitMQAdapter(rabbitMQConfig.url, messageOrc),
  kafka: new KafkaAdapter(kafkaConfig, messageOrc),
};

export const adapter = adapters[MESSAGE_QUEUE];
