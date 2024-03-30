const OpenAI = require("openai").OpenAI;

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || "",
});

const threads = openai.beta.threads;

module.exports = { threads }