import { adapter } from './config';
import { prepStart } from './setup/prepStart';
import { prepTearDown } from './teardown/prepTearDown';

(async () => {
  const {
    queue, consumers, producers, messages,
  } = await prepStart({
    adapter,
    queueNums: 1,
    consumerNums: 2,
    producerNums: 2,
    messageNums: 2,
  });

  // Record the message receiving times for consumers
  const handleMessage = (message) => {
    const timeDiff = Date.now() - message.createdAt;
    console.log(
      `time diff for message ${message.message} on consumer ${adapter.getConsumerId()} is ${timeDiff} ms`,
    );
  };

  // Connect consumers
  await Promise.all(
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
  prepTearDown({ adapter, consumers, queue });
})();
