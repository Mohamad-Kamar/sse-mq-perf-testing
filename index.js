import { orchestrator } from './utils/MessagesOrchestrator';
import { adapter } from './config';
import { setup } from './setup/mainSetup';
import { tearDown } from './teardown/mainTearDown';

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
  await orchestrator.finishConsumption();
  // Log time taken and average time for message to be consumed
  console.log(`TIME TAKEN FOR MESSAGE CONSUMPTION: ${orchestrator.getAverageTimeResults()}`);

  tearDown({
    consumers,
    producers,
    queues,
  });
}

main(1, 2, 2, 50);
