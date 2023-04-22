import { adapter } from './config';
import { prepStart } from './prepStart';
import { prepTearDown } from './prepTearDown';

(async () => {
  const {
    queues, consumers, producers, messages,
  } = await prepStart({
    adapter,
    queueNums: 2,
    consumerNums: 500,
    producerNums: 1,
    messageNums: 2,
  });

  // Record the message receiving times for consumers
  const handleMessage = (message) => {
    const timeDiff = Date.now() - message.createdAt;
    console.log(
      `time diff for message ${message.message} on consumer ${adapter.getConsumerId()} is ${timeDiff} ms`,
    );
    adapter.deleteConsumer(
      adapter.findConsumer(),
    ); // assuming that findConsumer() gets you the correct consumer
  };

  // Connect consumers
  const connectedConsumers = await Promise.all(
    consumers.map(async (consumer) => {
      await adapter.connect(consumer, handleMessage);
      return consumer;
    }),
  );

  // Send messages
  producers.forEach((producer) => {
    adapter.sendMessages(producer, messages);
  });

  // Run tear down logic
  prepTearDown({ adapter, consumers, queues });
})();
