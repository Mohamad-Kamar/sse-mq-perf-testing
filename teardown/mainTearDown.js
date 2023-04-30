export const tearDown = async ({
  consumers,
  producers,
  queues,
  adapterObject,
}) => {
  adapterObject.deleteConsumers(consumers);
  adapterObject.deleteProducers(producers);
  adapterObject.deleteQueues(queues);
};
