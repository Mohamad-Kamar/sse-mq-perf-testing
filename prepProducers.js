import { v4 as uuidv4 } from "uuid";
import { Producer } from "@mkamar/mq-lib";

export const prepProducers = (consumerNums, queueKey) => {
  let producers = [];
  for (let i = 0; i < consumerNums; i++) {
    const id = uuidv4();
    producers.push({
      id,
      createdAt: Date.now(),
      producerObj: new Producer("http://localhost:3491", {
        queueKey,
      }),
    });
    return producers;
  }
};
