import { uuid4 } from "uuid4";
import { Producer } from "@mkamar/mq-lib";

export const prepProducers = (consumerNums, queueKey) => {
  let producers = [];
  for (let i = 0; i < consumerNums; i++) {
    const id = uuid4();
    producers.push({
      id,
      createdAt: Date.now(),
      consumerObj: new Producer("http://localhost:3491", {
        queueKey,
      }),
    });
    return producers;
  }
};
