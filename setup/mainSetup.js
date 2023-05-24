export const setup = async (
  numOfQueues,
  numOfProducers,
  numOfConsumers,
  numOfMessages,
  adapterObject,
  messageOrchestrator,
) => {
  const queues = await adapterObject.createQueues(numOfQueues);

  const producers = (await Promise.all(
    queues.map((q) => adapterObject.createProducers(q, numOfProducers)),
  )).flat();
  // Create consumers after adding all messages to the orchestrator
  const consumers = (await Promise.all(
    queues.map((q) => adapterObject.createConsumers(q, numOfConsumers, messageOrchestrator)),
  )).flat();

  // Create Local Messages before creating consumers
  const messages = (await Promise.all(
    queues.map(() => adapterObject.createLocalMessages(numOfMessages, messageOrchestrator)),
  )).flat();

  return {
    queues, producers, consumers, messages,
  };
};
