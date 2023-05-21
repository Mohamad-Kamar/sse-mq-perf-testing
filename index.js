import { orchestrator } from './utils/MessagesOrchestrator.js';
import { adapter } from './config.js';
import { setup } from './setup/mainSetup.js';
import { tearDown } from './teardown/mainTearDown.js';

async function main(numOfQueues, numOfProducers, numOfConsumers, numOfMessages) {
  try {
    const {
      consumers,
      producers,
      messages,
      queues,
    } = await setup(
      numOfQueues,
      numOfProducers,
      numOfConsumers,
      numOfMessages,
      adapter,
      orchestrator,
    );

    // Start message production timer
    const productionStart = Date.now();
    // Produce messages through producers
    await Promise.all(
      messages.map(
        (messageContent, idx) => {
          orchestrator.registerPublishedTime(messageContent);
          return producers[idx % producers.length].publish(messageContent);
        },
      ),
    );
    const productionEnd = Date.now();
    const productionElapsedTime = productionEnd - productionStart;

    console.log(`For ${numOfQueues} queues,
    ${numOfProducers} producers],
    ${numOfConsumers} consumers,
    ${numOfMessages} messages`);

    // Log time taken and average time for message to be produced
    console.log(`TIME TAKEN FOR CREATING MESSAGES: ${productionElapsedTime}`);

    // Wait for all messages to be consumed
    await orchestrator.finishConsumption();
    // Log time taken and average time for message to be consumed
    console.log(`TIME TAKEN FOR MESSAGE CONSUMPTION: ${orchestrator.getAverageTimeResults()}`);

    await tearDown(
      consumers,
      producers,
      queues,
      adapter,
    );
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

main(1, 2, 2, 1000);
