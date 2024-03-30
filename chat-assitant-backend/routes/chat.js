const express = require('express');
const experimental_AssistantResponse = require('ai').experimental_AssistantResponse

const router = express.Router();

const threads = require('./helper/setup').threads
const createMessage = require('./helper/createMessage').createMessage
const queuedOrInprogressRun = require('./helper/threadRun').queuedOrInprogressRun
const createThreadRun = require('./helper/threadRun').createThreadRun
const actionHandler = require('./helper/actionHandler').actionHandler
const assistantResponse = require('./helper/assistantResponse').assistantResponse

router.post('/', async function(req, res, next) {

    const input = await req.body;
    const threadId = input.threadId ?? (await threads.create({})).id;

    const createdMessage = await createMessage(threads, threadId, input)
    
    experimental_AssistantResponse(
        { threadId, messageId: createdMessage.id },
        async ({ threadId }) => {
          
            const run = await createThreadRun(threads, threadId)
            
            async function waitForRun(run) {
        
                while (run.status !== 'completed') {
                    run = await queuedOrInprogressRun(run, threads, threadId)
                    run = await actionHandler(run, threads, threadId)

                    if (
                    run.status === "cancelled" ||
                    run.status === "cancelling" ||
                    run.status === "failed" ||
                    run.status === "expired"
                    ) {
                        throw new Error(run.status);
                    }
                }
                
                console.log(new Date(), "Run Completed", run.status)
            }
            await waitForRun(run);
            
            await assistantResponse(threads, threadId, createdMessage, res)
        })
    });

module.exports = router;