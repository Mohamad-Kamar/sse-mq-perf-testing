import { prepStart } from "./prepStart.js";
import { prepTearDown } from "./prepTearDown.js";

(async () => {
  const { queues, consumers, producers, messages } = await prepStart({
    1,
    5,
    1,
    1
  });
  const times = {};
  const connectedConsumers = await Promise.all(
    consumers.map(async (consumer) => {
      await consumer.consumerObj.connect();
      consumer.consumerObj.setOnMessage((messageString) => {
        const message = JSON.parse(messageString.data);
        const timeDiff = Date.now() - message.createdAt;
        console.log(
          `time diff for message ${message.message} on consumer ${consumer.consumerObj.consumerID} is ${timeDiff}`
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

  prepTearDown({ consumers, queues });
})();
