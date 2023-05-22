import { Consumer, Queue, Producer } from '@mkamar/mq-lib';
import { v4 as uuidv4 } from 'uuid';
import IMQAdapter from './IMQAdapter.js';

class SSEMQAdapter extends IMQAdapter {
  constructor(baseUrl) {
    super(baseUrl);
    this.baseUrl = baseUrl;
  }

  async init() {
    return '';
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

  async deleteConsumers(consumers) {
    return Promise.all(consumers.map((consumer) => this.deleteConsumer(consumer)));
  }

  async deleteConsumer(consumer) {
    return consumer.delete();
  }

  async deleteProducers(producers) {
    return Promise.all(producers.map((prod) => this.deleteProducer(prod)));
  }

  async deleteProducer(producer) {
    return Promise.resolve();
  }

  async deleteQueues(queues) {
    return Promise.all(queues.map((q) => this.deleteQueue(q)));
  }

  async deleteQueue(queue) {
    return Queue.deleteQueue({
      url: this.baseUrl,
      queueKey: queue.queueKey,
    });
  }
}

export default SSEMQAdapter;
