export const tearDown = async (
  consumers,
  producers,
  queues,
  adapterObject,
) => {
  await adapterObject.deleteConsumers(consumers);
  await adapterObject.deleteProducers(producers);
  await adapterObject.deleteQueues(queues);
  console.log('FINISHED RUN');
};
