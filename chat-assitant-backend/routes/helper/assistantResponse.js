const assistantResponse = async (
  threads,
  threadId,
  createdMessage,
  res
) => {
  const responseMessages = (
    await threads.messages.list(threadId, {
      after: createdMessage.id,
      order: 'asc'
    })
  ).data

  for (const message of responseMessages) {
    let resMessage = {
        id: message.id,
        threadId: threadId,
        role: 'assistant',
        content: message.content.filter(
          content => content.type === 'text'
        )
    }
    res.json(resMessage)
  }
  return responseMessages;
}

module.exports = { assistantResponse }
