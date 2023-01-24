import { v4 as uuidv4 } from "uuid";
import { Queue } from "@mkamar/mq-lib";

export const prepQueues = async (queueNums) => {
  let queues = [];
  for (let i = 0; i < queueNums; i++) {
    const currQ = await Queue.craeteQueue({
      url: "http://localhost:3491",
      queueKey: "tq1",
      queueType: "direct",
    });
    queues.push({
      id: uuidv4(),
      createdAt: Date.now(),
      queueObj: currQ,
    });
    return queues;
  }
};
