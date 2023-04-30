import { v4 as uuidv4 } from 'uuid';

export const prepMessages = (messageNumbers) => {
  const messages = [];

  for (let i = 0; i < messageNumbers; i++) {
    const id = uuidv4();
    messages.push(id);
  }
  return messages;
};
