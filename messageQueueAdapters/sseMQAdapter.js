import { Consumer, Producer } from '@mkamar/mq-lib';
import { v4 as uuidv4 } from 'uuid';

class SSEMQAdapter {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  async connect(consumer, handleMessage) {
    const { consumerObj, id } = consumer;
    consumerObj.on('message', (message) => {
      handleMessage(JSON.parse(message), id);
    });
    await consumerObj.connect();
  }

  async createProducers(producerNums, queueKey) {
    const producers = [];
    const start = Date.now();
    for (let i = 0; i < producerNums; i += 1) {
      const id = uuidv4();
      producers.push({
        id,
        createdAt: Date.now(),
        producerObj: new Producer(this.baseUrl, {
          queueKey,
        }),
      });
    }
    const end = Date.now();
    const elapsedTime = end - start;
    return { producers, elapsedTime };
  }

  async createConsumers(consumerNums, queueKey) {
    const consumers = [];
    const createdAt = Date.now();
    for (let i = 0; i < consumerNums; i += 1) {
      const id = uuidv4();
      consumers.push({
        id,
        createdAt,
        consumerObj: new Consumer(this.baseUrl, {
          queueKey,
          consumerID: id,
        }),
        receivedTimes: [],
      });
    }
    const end = Date.now();
    const elapsedTime = end - createdAt;
    return { consumers, elapsedTime };
  }

  async sendMessages(producer, messages) {
    const start = Date.now();
    messages.forEach((messageID) => {
      const currMessage = { message: messageID, createdAt: Date.now() };
      producer.producerObj.publish(JSON.stringify(currMessage));
    });
    const end = Date.now();
    const elapsedTime = end - start;
    return { elapsedTime };
  }

  async deleteConsumer(consumer) {
    consumer.consumerObj.delete();
  }

  async deleteQueue(queue) {
    Queue.deleteQueue({
      url: this.baseUrl,
      queueKey: queue.id,
    });
  }
}

export default SSEMQAdapter;
