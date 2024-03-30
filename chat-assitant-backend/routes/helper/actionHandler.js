const actionHandler = async (run, threads, threadId, ...tools) => {
    while (run.status === 'requires_action') {
        // const toolCall = [0]
        const toolCalls = run.required_action?.submit_tool_outputs?.tool_calls || []
        for (let toolCall of toolCalls) {
            let functionResponse;
            const method = tools.find((tool) => tool.name === toolCall.function.name)
            functionResponse = await method(toolCall.function.arguments)
            run = await threads.runs.retrieve(threadId, run.id);

            await threads.runs.submitToolOutputs(
                threadId,
                run.id,
                {
                    tool_outputs: [
                        {
                            tool_call_id: toolCall.id,
                            output: JSON.stringify(functionResponse),
                        }
                    ],
                }
            );
            run = await threads.runs.retrieve(threadId, run.id);
        }
    }
    return run;
}

module.exports = { actionHandler }