import amqp from 'amqplib';
import { v4 as uuidv4 } from 'uuid';
import IMQAdapter from './IMQAdapter.js';
import { output } from '../output.js';

class RabbitMQAdapter extends IMQAdapter {
  constructor(rabbitMQConfig) {
    super(rabbitMQConfig);
    this.rabbitMQConfig = rabbitMQConfig;
    this.connection = null;
    this.channel = null;
  }

  async init() {
    this.connection = await amqp.connect(this.rabbitMQConfig.url);
    this.channel = await this.connection.createConfirmChannel();
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

    const producerPromises = Array.from({ length: producerNums }, async (_, i) => {
      const currentConnection = await amqp.connect(this.rabbitMQConfig.url);
      const currentProducer = await currentConnection.createConfirmChannel();
      producers.push({
        exchange: queue,
        publish: async (messageContent) => {
          output.push(`Sending message with content: ${messageContent}`);
          await new Promise(
            (resolve, reject) => {
              currentProducer.sendToQueue(
                queue,
                Buffer.from(messageContent),
                { durable: false, noAck: false },
                (err, ok) => {
                  if (err !== null) {
                    reject(err);
                  } else {
                    resolve(ok);
                  }
                },
              );
            },
          );
          output.push(`MessageSent: ${messageContent}`);
        },
        currentProducer,
        currentConnection,
      });
    });
    await Promise.all(producerPromises);
    return producers;
  }

  async createConsumers(queue, consumerNums, messageOrchestrator) {
    const consumers = [];

    const consumerPromises = Array.from({ length: consumerNums }, async (_, i) => {
      const consumerID = uuidv4();
      const currentConnection = await amqp.connect(this.rabbitMQConfig.url);
      const currentConsumer = await currentConnection.createConfirmChannel();

      await currentConsumer.prefetch(1); // Add prefetch

      await currentConsumer.consume(queue, (msg) => {
        if (msg) {
          const messageContent = msg.content.toString();
          messageOrchestrator.registerReceivedTime(messageContent);
          currentConsumer.ack(msg);
        }
      }, { consumerTag: consumerID, noAck: false });
      output.push(`Consumer Created with ID ${consumerID}`);
      consumers.push({
        currentConsumer, queue, consumerID, currentConnection,
      });
    });

    await Promise.all(consumerPromises);
    return consumers;
  }

  async createLocalMessages(numOfMessages, messageOrchestrator) {
    const messages = [];
    for (let i = 0; i < numOfMessages; i += 1) {
      const id = uuidv4();
      messages.push(id);
      messageOrchestrator.addMessage(id);
    }

    return messages;
  }

  async deleteConsumers(consumers) {
    const deletePromises = consumers.map((consumer) => this.deleteConsumer(consumer));
    return Promise.all(deletePromises);
  }

  async deleteConsumer(consumer) {
    await consumer.currentConnection.close();

    return true;
  }

  async deleteProducers(producers) {
    return Promise.all(producers.map((prod) => this.deleteProducer(prod)));
  }

  async deleteProducer(producer) {
    // Close the producer channel and its connection
    await producer.currentConnection.close();

    return true;
  }

  async deleteQueues(queues) {
    const deletePromises = queues.map((queue) => this.deleteQueue(queue));
    return Promise.all(deletePromises);
  }

  async deleteQueue(queue) {
    await this.channel.deleteQueue(queue);
    await this.connection.close();
    return true;
  }
}

export default RabbitMQAdapter;
