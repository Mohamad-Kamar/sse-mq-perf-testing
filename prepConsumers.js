import { uuid4 } from "uuid4";
import { Consumer } from "@mkamar/mq-lib";

export const prepConsumers = (consumerNums, queueKey) => {
  let consumers = [];
  for (let i = 0; i < consumerNums; i++) {
    const id = uuid4();
    consumers.push({
      id,
      createdAt: Date.now(),
      consumerObj: new Consumer("localhost:3491", {
        queueKey,
        consumerID: id,
      }),
    });
    return consumers;
  }
};
