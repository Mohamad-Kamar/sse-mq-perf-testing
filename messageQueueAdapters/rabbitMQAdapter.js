import amqp from 'amqplib';
import { v4 as uuidv4 } from 'uuid';
import IMQAdapter from './IMQAdapter.js';

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
          await new Promise(
            (resolve, reject) => {
              currentProducer.sendToQueue(
                queue,
                Buffer.from(messageContent),
                { durable: false, noAck: false },
                (err, ok) => {
                  if (err !== null) {
                    console.warn('Message nacked!'); reject(err);
                  } else {
                    console.log('Message acked'); resolve(ok);
                  }
                },
              );
            },
          );
        },
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
      await currentConsumer.consume(queue, (msg) => {
        if (msg) {
          const messageContent = msg.content.toString();
          messageOrchestrator.registerReceivedTime(messageContent);
          this.channel.ack(msg);
        }
      }, { consumerTag: consumerID });

      consumers.push({ currentConsumer, queue, consumerID });
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

  async deleteConsumers(consumers) {
    const deletePromises = consumers.map((consumer) => this.deleteConsumer(consumer));
    return Promise.all(deletePromises);
  }

  async deleteConsumer(consumer) {
    await consumer.currentConsumer.cancel(consumer.consumerID);
    return true;
  }

  async deleteProducers(producers) {
    return Promise.all(producers.map((prod) => this.deleteProducer(prod)));
  }

  async deleteProducer(producer) {
    // No need for specific producer deletion as it's handled at the connection level.
    return Promise.resolve();
  }

  async deleteQueues(queues) {
    const deletePromises = queues.map((queue) => this.deleteQueue(queue));
    return Promise.all(deletePromises);
  }

  async deleteQueue(queue) {
    await this.channel.deleteQueue(queue);
    return true;
  }
}

export default RabbitMQAdapter;
