import { Consumer, Queue, Producer } from '@mkamar/mq-lib';
import { v4 as uuidv4 } from 'uuid';
import IMQAdapter from './IMQAdapter';

class SSEMQAdapter extends IMQAdapter {
  constructor(baseUrl) {
    super(baseUrl);
    this.baseUrl = baseUrl;
  }

  async createQueues(numOfQueues) {
    const id = uuidv4();
    const queues = [];
    for (let i = 0; i < numOfQueues; i += 1) {
      const currQ = Queue.craeteQueue({
        url: 'http://localhost:3491',
        queueKey: id,
        queueType: 'fanout',
      });
      queues.push(currQ);
    }
    return Promise.all(queues);
  }

  async createProducers(queue, producerNums) {
    const { queueKey } = queue;
    const producers = [];
    for (let i = 0; i < producerNums; i += 1) {
      producers.push(new Producer(this.baseUrl, { queueKey }));
    }
    return producers;
  }

  async createConsumers(queue, consumerNums, messageOrchestrator) {
    const { queueKey } = queue;
    const consumers = [];
    for (let i = 0; i < consumerNums; i += 1) {
      consumers.push(new Consumer(this.baseUrl, { queueKey, consumerID: uuidv4() }));
    }

    await Promise.all(consumers.map(((consumer) => consumer.connect())));
    consumers.forEach((consumer) => consumer.setOnMessage(
      (message) => messageOrchestrator.registerReceivedTime(message.data),
    ));
    return consumers;
  }

  async createLocalMessages(numOfMessages, messageOrchestrator) {
    for (let i = 0; i < numOfMessages; i += 1) {
      messageOrchestrator.addMessage(uuidv4());
    }
    return Object.keys(messageOrchestrator.getMessages());
  }

  async sendMessages(producer, messages) {
    return messages.map((messageID) => {
      const currMessage = { message: messageID, createdAt: Date.now() };
      return producer.producerObj.publish(JSON.stringify(currMessage));
    });
  }

  async deleteConsumer(consumer) {
    consumer.delete();
  }

  async deleteQueue(queue) {
    Queue.deleteQueue({
      url: this.baseUrl,
      queueKey: queue.id,
    });
  }
}

export default SSEMQAdapter;
