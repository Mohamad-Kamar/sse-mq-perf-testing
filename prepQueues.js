import { uuid4 } from "uuid4";
import { Queue } from "@mkamar/mq-lib";

export const prepQueues = (queueNums) => {
  let queues = [];
  for (let i = 0; i < queueNums; i++) {
    queues.push({
      id: uuid4(),
      createdAt: Date.now(),
      queueObj: Queue.craeteQueue({
        url: "http://localhost:3491",
        queueKey: "tq1",
        queueType: "direct",
      }),
    });
    return queues;
  }
};
