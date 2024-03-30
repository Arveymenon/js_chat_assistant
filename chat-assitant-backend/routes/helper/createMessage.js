async function createMessage(threads, threadId, input) {
    // Add a message to the thread
      const createdMessage = await threads.messages.create(threadId, {
        role: "user",
        content: input.message,
      });
      return createdMessage
}

module.exports = { createMessage };