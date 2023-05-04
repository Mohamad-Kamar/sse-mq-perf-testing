class MessagesOrchestrator {
  messages = {};

  constructor() {
    this.messages = {};
  }

  addMessage(messageID) {
    this.messages[messageID] = {
      publishedAt: null,
      receivedAt: null,
      elapsedTime: null,
    };
  }

  registerPublishedTime(messageID) {
    this.messages[messageID].publishedAt = Date.now();
  }

  registerReceivedTime(messageID) {
    const receivedMessage = this.messages[messageID];
    receivedMessage.receivedAt = Date.now();
  }

  registerElapsedTime(messageID) {
    const receivedMessage = this.messages[messageID];
    receivedMessage.elapsedTime = receivedMessage.receivedAt - receivedMessage.publishedAt;
  }

  getAverageTimeResults() {
    const validMessages = Object.keys(this.messages)
      .filter((currMessage) => (this.messages[currMessage.messageID].elapsedTime))
      .map((currMessage) => (this.messages[currMessage.messageID].elapsedTime));
    const allElapsedTime = validMessages.reduce(
      (currTime, totalTime) => currTime + totalTime,
      0,
    );
    return allElapsedTime / validMessages.length;
  }

  async finishConsumption(timeInterval = 1000) {
    const waitForAllPublishedAt = () => Object.keys(this.messages).every(
      (messageID) => this.messages[messageID].receivedAt !== null,
    );

    return new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        if (waitForAllPublishedAt()) {
          clearInterval(checkInterval);
          resolve();
        }
      }, timeInterval);
    });
  }
}

export const orchestrator = new MessagesOrchestrator();
