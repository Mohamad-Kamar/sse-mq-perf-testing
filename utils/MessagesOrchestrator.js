class MessagesOrchestrator {
  constructor() {
    this.messages = {};
    this.totalReceivedMessages = 0;
    this.expectedMessageCount = 0;
    this.consumptionFinishedResolver = null;
    this.consumptionFinishedPromise = null;
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
    this.totalReceivedMessages += 1;

    if (this.totalReceivedMessages === this.expectedMessageCount
       && this.consumptionFinishedResolver) {
      this.consumptionFinishedResolver();
    }
  }

  registerElapsedTime(messageID) {
    const receivedMessage = this.messages[messageID];
    receivedMessage.elapsedTime = receivedMessage.receivedAt - receivedMessage.publishedAt;
    console.log(`registered message time ${messageID}`);
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

  async finishConsumption(expectedMessageCount) {
    this.expectedMessageCount = expectedMessageCount;

    if (this.totalReceivedMessages === this.expectedMessageCount) {
      return;
    }

    this.consumptionFinishedPromise = new Promise((resolve) => {
      this.consumptionFinishedResolver = resolve;
    });

    await this.consumptionFinishedPromise;
  }
}

export const orchestrator = new MessagesOrchestrator();
