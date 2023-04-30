import { Queue } from '@mkamar/mq-lib';

export const prepTearDown = ({ consumers, queues }) => {
  queues.forEach((queue) => {
    Queue.deleteQueue({
      url: 'http://localhost:3491',
      queueKey: queue.id,
    });
    console.log(`DELETED ${queue.id}`);
  });
};
