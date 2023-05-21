import amqp from 'amqplib';
import { v4 as uuidv4 } from 'uuid';
import IMQAdapter from './IMQAdapter.js';

class RabbitMQAdapter extends IMQAdapter {
  constructor(rabbitMQConfig) {
    super(rabbitMQConfig);
    this.rabbitMQConfig = rabbitMQConfig;
    this.connection = null;
    this.channel = null;

    this.init();
  }

  async init() {
    this.connection = await amqp.connect(this.rabbitMQConfig.url);
    this.channel = await this.connection.createChannel();
  }

  async createQueues(numOfQueues) {
    const queuePromises = Array.from({ length: numOfQueues }, async (_, index) => {
      const queueName = `queue-${index}`;
      await this.channel.assertQueue(queueName);
      return queueName;
    });

    return Promise.all(queuePromises);
  }

  async createProducers(queue, producerNums) {
    const producers = [];

    for (let i = 0; i < producerNums; i += 1) {
      producers.push({ queue });
    }

    return producers;
  }

  async createConsumers(queue, consumerNums, messageOrchestrator) {
    const consumers = [];

    const consumerPromises = Array.from({ length: consumerNums }, async (_, i) => {
      const consumerID = uuidv4();
      await this.channel.consume(queue, (msg) => {
        if (msg) {
          const messageContent = msg.content.toString();
          messageOrchestrator.registerReceivedTime(messageContent);
          this.channel.ack(msg);
        }
      }, { consumerTag: consumerID });

      consumers.push({ queue, consumerID });
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
    const messageBuffers = messages.map((messageID) => {
      const messageContent = JSON.stringify({ message: messageID, createdAt: Date.now() });
      return Buffer.from(messageContent);
    });

    messageBuffers.forEach((buffer) => {
      this.channel.sendToQueue(producer.queue, buffer);
    });

    return messageBuffers.length;
  }

  async deleteQueues(queues) {
    const deletePromises = queues.map((queue) => this.deleteQueue(queue));
    return Promise.all(deletePromises);
  }

  async deleteQueue(queue) {
    await this.channel.deleteQueue(queue);
    return true;
  }

  async deleteProducers(producers) {
    // No need for specific producer deletion as it's handled at the connection level.
    return true;
  }

  async deleteConsumers(consumers) {
    const deletePromises = consumers.map((consumer) => this.deleteConsumer(consumer));
    return Promise.all(deletePromises);
  }

  async deleteConsumer(consumer) {
    await this.channel.cancel(consumer.consumerID);
    return true;
  }
}

export default RabbitMQAdapter;
