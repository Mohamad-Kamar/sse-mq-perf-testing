import { Consumer, Producer, Queue } from '@mkamar/mq-lib';
import { v4 as uuidv4 } from 'uuid';

class SSEMQAdapter {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  async connect(consumer) {
    await consumer.consumerObj.connect();
    return consumer;
  }

  async createProducers(producerNums, queueKey) {
    const producers = [];
    for (let i = 0; i < producerNums; i++) {
      const id = uuidv4();
      producers.push({
        id,
        createdAt: Date.now(),
        producerObj: new Producer(this.baseUrl, {
          queueKey,
        }),
      });
    }
    return producers;
  }

  async createConsumers(consumerNums, queueKey) {
    const consumers = [];
    const createdAt = Date.now();
    for (let i = 0; i < consumerNums; i++) {
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
    return consumers;
  }

  async sendMessages(producer, messages) {
    messages.forEach((messageID) => {
      const currMessage = { message: messageID, createdAt: Date.now() };
      producer.producerObj.publish(JSON.stringify(currMessage));
    });
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
