import { Kafka } from 'kafkajs';
import { v4 as uuidv4 } from 'uuid';
import IMQAdapter from './IMQAdapter.js';

class KafkaAdapter extends IMQAdapter {
  constructor(kafkaConfig) {
    super(kafkaConfig);
    this.kafkaConfig = kafkaConfig;
    this.kafkaInstance = null;
    this.producerInstance = null;
  }

  async init() {
    this.kafkaInstance = new Kafka(this.kafkaConfig);
    this.adminInstance = this.kafkaInstance.admin();
    this.producerInstance = this.kafkaInstance.producer();

    await this.adminInstance.connect();
    await this.producerInstance.connect();
  }

  async createQueues(numOfQueues) {
    const queuePrefix = 'queue-';
    const topicsToCreate = Array(numOfQueues)
      .fill(null)
      .map((_, index) => ({
        topic: `${queuePrefix}${index}`,
        numPartitions: 1, // Adjust the number of partitions as per your requirements
        replicationFactor: 1, // Adjust the replication factor as per your requirements
      }));

    await this.adminInstance.createTopics({
      topics: topicsToCreate,
      waitForLeaders: true,
    });

    return topicsToCreate.map((topicConfig) => topicConfig.topic);
  }

  async createProducers(queue, producerNums) {
    const producers = [];

    for (let i = 0; i < producerNums; i += 1) {
      producers.push({
        topic: queue,
        publish: async (messageContent) => {
          await this.producerInstance.send({
            topic: queue,
            messages: [{ value: messageContent }],
          });
        },
      });
    }

    return producers;
  }

  async createConsumers(queue, consumerNums, messageOrchestrator) {
    const consumers = [];

    const consumerPromises = Array.from({ length: consumerNums }, async (_, i) => {
      const currentConsumer = this.kafkaInstance.consumer({ groupId: uuidv4() });

      await currentConsumer.connect();
      await currentConsumer.subscribe({ topic: queue, fromBeginning: true });

      currentConsumer.run({
        eachMessage: async ({ message }) => {
          messageOrchestrator.registerReceivedTime(message.value.toString());
        },
      });

      consumers.push(currentConsumer);
    });

    await Promise.all(consumerPromises);

    return consumers;
  }

  async createLocalMessages(numOfMessages, messageOrchestrator) {
    for (let i = 0; i < numOfMessages; i += 1) {
      messageOrchestrator.addMessage(uuidv4());
    }

    return Object.keys(messageOrchestrator.getMessages());
  }

  async sendMessages(producer, messages) {
    const messagesToSend = messages.map((messageID) => ({
      value: JSON.stringify({ message: messageID, createdAt: Date.now() }),
    }));
  }

  async deleteQueues(queues) {
    // In Kafka, topics deletion should be managed by the Kafka broker.
    // Thus, there is no need to delete topics in the adapter.
    return this.deleteAdmin();
  }

  async deleteAdmin() {
    return this.adminInstance.disconnect();
  }

  async deleteQueue(queue) {
    // Same reasoning as in deleteQueues() method
    return Promise.resolve();
  }

  async deleteProducers(producers) {
    await this.producerInstance.disconnect();
    return Promise.resolve();
  }

  async deleteConsumers(consumers) {
    return Promise.all(consumers.map((consumer) => this.deleteConsumer(consumer)));
  }

  async deleteConsumer(consumer) {
    return consumer.disconnect();
  }
}

export default KafkaAdapter;
