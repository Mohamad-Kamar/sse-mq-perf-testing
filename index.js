import { adapter } from "./config";
import { prepStart } from "./prepStart";
import { prepTearDown } from "./prepTearDown";

(async () => {
  const { queues, consumers, producers, messages } = await prepStart({
    adapter,
    queueNums: 2,
    consumerNums: 500,
    producerNums: 1,
    messageNums: 2,
  });

  const times = {};
  const connectedConsumers = await Promise.all(
    consumers.map(async (consumer) => {
      await consumer.consumerObj.connect();
      consumer.consumerObj.setOnMessage((messageString) => {
        const message = JSON.parse(messageString.data);
        const timeDiff = Date.now() - message.createdAt;
        console.log(
          `time diff for message ${message.message} on consumer ${consumer.consumerObj.consumerID} is ${timeDiff} ms`
        );
        consumer.consumerObj.delete();
      });
      return consumer;
    })
  );
  producers.forEach((prod) => {
    messages.forEach((messageID) => {
      const currMessage = { message: messageID, createdAt: Date.now() };
      times[messageID] = currMessage;
      prod.producerObj.publish(JSON.stringify(currMessage));
    });
  });

  prepTearDown({ adapter, consumers, queues });
})();
