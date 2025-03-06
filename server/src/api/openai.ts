import { OpenAI } from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// Retrieves the Assistant
export async function retrieveAssistant(assistantId: string) {
    const assistant = await openai.beta.assistants.retrieve(assistantId);
    return assistant;
}

// Create a Thread
export async function createThread() {
    const thread = await openai.beta.threads.create();
    return thread;
}

// Add a message to a Thread
export async function addMessageToThread(threadId: string, userMessageText: string) {
    const message = await openai.beta.threads.messages.create(threadId, {
        role: "user",
        content: userMessageText
    });
    return message;
}

// Run the Assistant and Poll for Completion
export async function runAssistant(threadId: string, assistantId: string): Promise<[Error] | [undefined, OpenAI.Beta.Threads.Messages.Message[]]> {
    const run = await openai.beta.threads.runs.create(threadId, {
        assistant_id: assistantId
    });

    if (run.status === "completed") {
        const messages = await openai.beta.threads.messages.list(threadId);
        return [undefined, messages.data]; // Return all messages (including assistant's response)
    }

    return [new Error(`Run failed with status: ${run.status}`)];
}
