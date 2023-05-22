export default class IMQAdapter {
  async init() {
    throw new Error('init method must be implemented');
  }

  async createQueues(numOfQueues) {
    throw new Error('createQueues method must be implemented');
  }

  async createProducers(queue, producerNums) {
    throw new Error('createProducers method must be implemented');
  }

  async createConsumers(queue, consumerNums, messageOrchestrator) {
    throw new Error('createConsumers method must be implemented');
  }

  async createLocalMessages(numOfMessages, messageOrchestrator) {
    throw new Error('createLocalMessages method must be implemented');
  }

  async deleteConsumers(consumers) {
    throw new Error('deleteConsumers method must be implemented');
  }

  async deleteConsumer(consumer) {
    throw new Error('deleteConsumer method must be implemented');
  }

  async deleteProducers(producers) {
    throw new Error('deleteProducers method must be implemented');
  }

  async deleteProducer(producer) {
    throw new Error('deleteProducer method must be implemented');
  }

  async deleteQueues(queues) {
    throw new Error('deleteQueues method must be implemented');
  }

  async deleteQueue(queue) {
    throw new Error('deleteQueue method must be implemented');
  }
}
