class MessagesOrchestrator {
  messages = {};

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
    return allElapsedTime.length / allElapsedTime;
  }
}

export const orchestrator = new MessagesOrchestrator();