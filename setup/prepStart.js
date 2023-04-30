import { v4 as uuidv4 } from 'uuid';

export const prepStart = async ({
  adapter,
  queueNums,
  consumerNums,
  producerNums,
  messageNums,
}) => {
  // Create consumers
  const { consumers, elapsedTime: consumersElapsedTime } = await adapter.createConsumers(
    consumerNums,
    queueNums,
  );

  // Create producers
  const { producers, elapsedTime: producersElapsedTime } = await adapter.createProducers(
    producerNums,
    queueNums,
  );

  // Prepare messages
  const messages = [];
  for (let i = 0; i < messageNums; i += 1) {
    const id = uuidv4();
    messages.push(id);
  }

  // Measure average creation times
  const avgConsumerCreationTime = consumersElapsedTime / (queueNums * consumerNums);
  console.log(`Average consumer creation time: ${avgConsumerCreationTime} ms`);

  const avgProducerCreationTime = producersElapsedTime / (queueNums * producerNums);
  console.log(`Average producer creation time: ${avgProducerCreationTime} ms`);

  return {
    consumers,
    producers,
    messages,
  };
};
