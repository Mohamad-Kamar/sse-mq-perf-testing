import { output } from '../output.js';

export const tearDown = async (
  consumers,
  producers,
  queues,
  adapterObject,
) => {
  await adapterObject.deleteConsumers(consumers);
  await adapterObject.deleteProducers(producers);
  await adapterObject.deleteQueues(queues);
  output.push('FINISHED RUN');
};
