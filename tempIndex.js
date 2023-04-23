import { adapter } from './config';

const setup = async (
  numOfQueues,
  numOfProducers,
  numOfConsumers,
  numOfMessages,
  adapterObject,
) => {
  await adapterObject.init();
  const queues = await adapterObject.createQueues(numOfQueues);

  const producers = (await Promise.all(
    queues.map((q) => adapterObject.createProducers(q, numOfProducers)).flat(),
  ));
  const consumers = (await Promise.all(
    queues.map((q) => adapterObject.createConsumers(q, numOfConsumers)).flat(),
  ));

  const messages = adapterObject.createMessages(numOfMessages);

  return {
    queues, producers, consumers, messages,
  };
};

const tearDown = async ({
  consumers,
  producers,
  queues,
  adapterObject,
}) => {
  adapterObject.deleteConsumers(consumers);
  adapterObject.deleteProducers(producers);
  adapterObject.deleteDelete(queues);
};

async function main(numOfQueues, numOfProducers, numOfConsumers, numOfMessages) {
  const {
    consumers,
    producers,
    fakeMessaegs,
    queues,
  } = setup(numOfQueues, numOfProducers, numOfConsumers, numOfMessages, adapter);

  // Start timer

  // Produce messages through each producer

  // Stop timer

  // Log time taken and average time for message to be produced

  // Start timer

  // Consume messages

  // Stop timer

  // Log time taken and average time for message to be consumed

  tearDown({
    consumers,
    producers,
    queues,
  });
}

main(1, 2, 2, 50);
