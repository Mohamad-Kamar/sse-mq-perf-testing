import { uuid4 } from "uuid4";

export const prepMessages = (messageNumbers) => {
  const messages = [];
  for (let i = 0; i < messageNumbers; i++) {
    messages.push(uuid());
  }
  return messages;
};
