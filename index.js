import { prepStart } from "./prepStart";

const { queues, consumers, producers, messages } = prepStart(1, 1, 2, 10);
