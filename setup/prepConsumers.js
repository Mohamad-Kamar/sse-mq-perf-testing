import { v4 as uuidv4 } from 'uuid';
import { Consumer } from '@mkamar/mq-lib';

export const prepConsumers = (consumerNums, queueKey) => {
  const consumers = [];
  const createdAt = Date.now();
  for (let i = 0; i < consumerNums; i += 1) {
    const id = uuidv4();
    consumers.push({
      id,
      createdAt,
      consumerObj: new Consumer('http://localhost:3491', {
        queueKey,
        consumerID: id,
      }),
      receivedTimes: [],
    });
  }
  return consumers;
};
