import { prepConsumers } from "./prepConsumers.js";
import { prepMessages } from "./prepMessages.js";
import { prepProducers } from "./prepProducers.js";
import { prepQueues } from "./prepQueues.js";

export const prepStart = async (
  queueNums,
  consumerNums,
  producerNums,
  messageNums
) => {
  const queues = await prepQueues(queueNums);
  const consumers = queues
    .map((queue) => prepConsumers(consumerNums, queue.id))
    .flat();
  const producers = queues
    .map((queue) => prepProducers(producerNums, queue.id))
    .flat();
  const messages = prepMessages(messageNums);
  return {
    queues,
    consumers,
    producers,
    messages,
  };
};
