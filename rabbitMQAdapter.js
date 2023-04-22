import amqp from 'amqplib';

class RabbitMQAdapter {
  constructor(url) {
    this.url = url;
    this.connection = null;
    this.channel = null;
  }

  async init() {
    this.connection = await amqp.connect(this.url);
    this.channel = await this.connection.createChannel();
  }

  async connect(consumer, handler) {
    const { consumerObj } = consumer;
    const q = consumerObj.queueKey;
    await this.channel.assertQueue(q, consumerObj.queueParams);
    await this.channel.consume(
      q,
      (msg) => handler(JSON.parse(msg.content.toString())),
      { noAck: true }
    );
  }

  async createProducers(producerNums, queueKey) {
    await this.init();

    let producers = [];
    for (let i = 0; i < producerNums; i++) {
      const id = uuidv4();
      producers.push({
        id,
        createdAt: Date.now(),
        producerObj: {
          queueKey,
          queueParams: { durable: false },
        },
      });
    }
    return producers;
  }

  async createConsumers(consumerNums, queueKey) {
    await this.init();

    let consumers = [];
    for (let i = 0; i < consumerNums; i++) {
      const id = uuidv4();
      consumers.push({
        id,
        createdAt: Date.now(),
        consumerObj: {
          queueKey,
          queueParams: { durable: false },
        },
      });
    }
    return consumers;
  }

  async sendMessages(producer, messages) {
    const q = producer.producerObj.queueKey;
    await this.channel.assertQueue(q, producer.producerObj.queueParams);

    messages.forEach((messageID) => {
      const currMessage = { message: messageID, createdAt: Date.now() };
      this.channel.sendToQueue(q, Buffer.from(JSON.stringify(currMessage)));
    });
  }

  async deleteConsumer(consumer) {
    // RabbitMQ automatically removes consumer when the channel is closed.
    await this.channel.close();
  }

  async deleteQueue(queue) {
    await this.channel.assertQueue(queue.id);
    await this.channel.deleteQueue(queue.id);
  }
}

export default RabbitMQAdapter;
