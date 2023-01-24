import { prepConsumers } from "./prepConsumers";
import { prepMessages } from "./prepMessages";
import { prepProducers } from "./prepProducers";
import { prepQueues } from "./prepQueues";

export const prepStart = (
  queueNums,
  consumerNums,
  producerNums,
  messageNums
) => {
  const queues = prepQueues(queueNums);
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
