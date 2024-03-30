const createThreadRun = async (threads, threadId) => {
    const thread = await threads.runs.create(threadId, {
        assistant_id:
          process.env.ASSISTANT_ID ??
          (() => {
            throw new Error("ASSISTANT_ID is not set");
          })(),
      });

      return thread
}

const queuedOrInprogressRun = async (run, threads, threadId) => {
    while (run.status === "queued" || run.status === "in_progress") {
        // delay for 500ms:
        console.log(new Date(), run.status, "Run in progress: Current Status", run.status)
        await new Promise((resolve) => {
          setTimeout(()=> {
              console.log(new Date(), "Run in progress 1...", run.status)
              resolve(true)
            }, 200);
        })
        
        run = await threads.runs.retrieve(threadId, run.id);
    }
    console.log(new Date(), "queuedOrInprogressRun completed: Not in progress", run.status)
    return run;
}

module.exports = { createThreadRun, queuedOrInprogressRun }