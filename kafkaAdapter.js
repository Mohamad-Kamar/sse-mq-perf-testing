import { Kafka } from 'kafkajs';
import { v4 as uuidv4 } from 'uuid';

class KafkaAdapter {
  constructor(kafkaConfig) {
    this.kafka = new Kafka(kafkaConfig);
    this.producer = this.kafka.producer();
  }

  async connect(consumer, handler) {
    const { consumerObj } = consumer;
    const kafkaConsumer = this.kafka.consumer({ groupId: consumerObj.groupId });
    await kafkaConsumer.connect();
    await kafkaConsumer.subscribe({ topic: consumerObj.topic, fromBeginning: true });

    await kafkaConsumer.run({
      eachMessage: async ({ message }) => {
        handler(JSON.parse(message.value.toString()));
      },
    });
  }

  async createProducers(producerNums, topic) {
    await this.producer.connect();

    let producers = [];
    for (let i = 0; i < producerNums; i++) {
      const id = uuidv4();
      producers.push({
        id,
        createdAt: Date.now(),
        producerObj: {
          topic,
        },
      });
    }
    return producers;
  }

  async createConsumers(consumerNums, topic) {
    const groupId = `${topic}-group`;

    let consumers = [];
    for (let i = 0; i < consumerNums; i++) {
      const id = uuidv4();
      consumers.push({
        id,
        createdAt: Date.now(),
        consumerObj: {
          topic,
          groupId,
        },
      });
    }
    return consumers;
  }

  async sendMessages(producer, messages) {
    const { topic } = producer.producerObj;

    const messagePayloads = messages.map((messageID) => {
      const currMessage = { message: messageID, createdAt: Date.now() };
      return {
        topic,
        messages: [{ value: JSON.stringify(currMessage), key: messageID }],
      };
    });

    for (const messagePayload of messagePayloads) {
      await this.producer.send(messagePayload);
    }
  }

  async deleteConsumer(consumer) {
    // In Kafka, consumers are automatically removed when they leave the group.
    // So the implementers may run their own custom logic to manually remove a consumer from the group.
  }

  // Note: Deleting a topic in Kafka is a highly debated feature and not always recommended,
  // but here is a helper function that may delete a topic if your Kafka allows it.
  // Uncomment the following block if you want to enable this feature.
  //
  // async deleteTopic(topic) {
  //   const admin = this.kafka.admin();
  //   await admin.connect();
  //   try {
  //     await admin.deleteTopics({
  //       topics: [topic],
  //       timeout: 1000,
  //     });
  //   } finally {
  //     await admin.disconnect();
  //   }
  // }
}

export default KafkaAdapter;
