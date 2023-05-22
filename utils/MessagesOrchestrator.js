class MessagesOrchestrator {
  constructor() {
    this.messages = {};
  }

  getMessages() {
    return this.messages;
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
    this.registerElapsedTime(messageID);
  }

  registerElapsedTime(messageID) {
    const receivedMessage = this.messages[messageID];
    receivedMessage.elapsedTime = receivedMessage.receivedAt - receivedMessage.publishedAt;
    console.log(messageID);
  }

  getAverageTimeResults() {
    const validMessagesElapsedTime = Object.keys(this.messages)
      .filter((currMessage) => (this.messages[currMessage].elapsedTime))
      .map((currMessage) => (this.messages[currMessage].elapsedTime));
    const allElapsedTime = validMessagesElapsedTime.reduce(
      (currTime, totalTime) => currTime + totalTime,
      0,
    );
    return allElapsedTime / validMessagesElapsedTime.length;
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
