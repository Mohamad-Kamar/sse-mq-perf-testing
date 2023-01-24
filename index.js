import { prepStart } from "./prepStart.js";

(async () => {
  const { queues, consumers, producers, messages } = await prepStart(
    1,
    5,
    1,
    1
  );
  const times = {};
  consumers.forEach(async (consumer) => {
    await consumer.consumerObj.connect();
    consumer.consumerObj.setOnMessage((messageString) => {
      const message = JSON.parse(messageString.data);
      const timeDiff = Date.now() - message.createdAt;
      console.log(`time diff for message ${message.message} is ${timeDiff}`);
    });
  });
  producers.forEach((prod) => {
    messages.forEach((messageID) => {
      const currMessage = { message: messageID, createdAt: Date.now() };
      times[messageID] = currMessage;
      prod.producerObj.publish(JSON.stringify(currMessage));
    });
  });
})();
