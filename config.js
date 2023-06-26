import * as dotenv from 'dotenv';
import SSEMQAdapter from './messageQueueAdapters/sseMQAdapter.js';
import EventFlowMQAdapter from './messageQueueAdapters/eventFlowMQAdapter.js';
import RabbitMQAdapter from './messageQueueAdapters/rabbitMQAdapter.js';
import KafkaAdapter from './messageQueueAdapters/kafkaAdapter.js';

dotenv.config();

const MESSAGE_QUEUE = process.env.MESSAGE_QUEUE || 'ssemq';

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

const eventFlowMQConfig = {
  baseUrl: 'http://localhost:8080',
};

const adapters = {
  ssemq: [SSEMQAdapter, sseMQConfig.baseUrl],
  eventflowmq: [EventFlowMQAdapter, eventFlowMQConfig.baseUrl],
  rabbitmq: [RabbitMQAdapter, rabbitMQConfig.url],
  kafka: [KafkaAdapter, kafkaConfig],
};

const [AdapterClass, adapterConfigs] = adapters[MESSAGE_QUEUE];
const adapter = new AdapterClass(adapterConfigs);
await adapter.init();
export { adapter };
