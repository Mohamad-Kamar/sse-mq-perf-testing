import { orchestrator } from './MessagesOrchestrator';
import { adapter } from './config';

const setup = async (
  numOfQueues,
  numOfProducers,
  numOfConsumers,
  numOfMessages,
  adapterObject,
  messageOrchestrator,
) => {
  await adapterObject.init();
  const queues = await adapterObject.createQueues(numOfQueues);

  const producers = (await Promise.all(
    queues.map((q) => adapterObject.createProducers(q, numOfProducers)).flat(),
  ));
  const consumers = (await Promise.all(
    queues.map((q) => adapterObject.createConsumers(q, numOfConsumers, messageOrchestrator)).flat(),
  ));

  const messages = (await Promise.all(
    queues.map(() => adapterObject.createLocalMessages(numOfMessages, messageOrchestrator)).flat(),
  ));

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
    messages,
    queues,
  } = setup(numOfQueues, numOfProducers, numOfConsumers, numOfMessages, adapter, orchestrator);

  // Start message production timer
  const productionStart = Date.now();
  // Produce messages through producers
  await Promise.all(messages.map(
    (messageContent, idx) => producers[idx % producers.length].publish(messageContent),
  ));
  const productionEnd = Date.now();
  const productionElapsedTime = productionEnd - productionStart;

  // Log time taken and average time for message to be produced
  console.log(`TIME TAKEN FOR CREATIGN MESSAGES: ${productionElapsedTime}`);

  // Wait for all messages to be consumed
  await adapter.finishConsumption();
  // Log time taken and average time for message to be consumed
  console.log(`TIME TAKEN FOR MESSAGE CONSUMPTION: ${orchestrator.getAverageTimeResults()}`);

  tearDown({
    consumers,
    producers,
    queues,
  });
}

main(1, 2, 2, 50);
