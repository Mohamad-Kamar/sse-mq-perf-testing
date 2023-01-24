import { prepConsumers } from "./prepConsumers";
import { prepMessages } from "./prepMessages";
import { prepProducers } from "./prepProducers";
import { prepQueues } from "./prepQueues";

export const queues = prepQueues(1);
export const consumers = queues
  .map((queue) => prepConsumers(2, queue.id))
  .flat();
export const producers = queues
  .map((queue) => prepProducers(2, queue.id))
  .flat();
export const messages = prepMessages(10);
