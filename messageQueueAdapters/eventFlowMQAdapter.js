import { v4 as uuidv4 } from 'uuid';
import EventSource from 'eventsource';
import fetch from 'cross-fetch';
import IMQAdapter from './IMQAdapter.js';
import { output } from '../output.js';

class EventFlowMQAdapter extends IMQAdapter {
  constructor(baseUrl) {
    super(baseUrl);
    this.baseUrl = baseUrl;
  }

  async init() {
    return '';
  }

  async createQueues(numOfQueues) {
    const queues = [];
    for (let i = 0; i < numOfQueues; i += 1) {
      queues.push(uuidv4());
    }
    return Promise.all(queues);
  }

  async createProducers(queue, producerNums) {
    const producers = [];
    const producerPromises = Array.from({ length: producerNums }, async (_, i) => {
      const producingUrl = `${this.baseUrl}/producer/produce`;
      const currentProducer = {
        publish: async (messageContent) => {
          output.push(`Sending message with content: ${messageContent}`);
          await fetch(`${producingUrl}?queueKey=${queue}&message=${messageContent}`);
          output.push(`MessageSent: ${messageContent}`);
        },
        queue,
      };
      producers.push(currentProducer);
    });
    await Promise.all(producerPromises);

    return producers;
  }

  async createConsumers(queue, consumerNums, messageOrchestrator) {
    const consumers = [];
    for (let i = 0; i < consumerNums; i += 1) {
      const consumer = new EventSource(`${this.baseUrl}/consumer/connect?queueKey=${queue}`);
      consumer.onmessage = (message) => {
        messageOrchestrator.registerReceivedTime(message.data);
      };
      consumers.push(consumer);
    }
    return consumers;
  }

  async createLocalMessages(numOfMessages, messageOrchestrator) {
    for (let i = 0; i < numOfMessages; i += 1) {
      messageOrchestrator.addMessage(uuidv4());
    }
    return Object.keys(messageOrchestrator.getMessages());
  }

  async deleteConsumers(consumers) {
    return '';
  }

  async deleteConsumer(consumer) {
    return '';
  }

  async deleteProducers(producers) {
    return '';
  }

  async deleteProducer(producer) {
    return '';
  }

  async deleteQueues(queues) {
    return '';
  }

  async deleteQueue(queue) {
    return '';
  }
}

export default EventFlowMQAdapter;
