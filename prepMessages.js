import { uuid4 } from "uuid4";

export const prepMessages = (messageNumbers) => {
  const messages = [];
  const id = uuid4();

  for (let i = 0; i < messageNumbers; i++) {
    messages.push({ id, createdAt: Date.now() });
  }
  return messages;
};
