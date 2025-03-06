import { retrieveAssistant, createThread, addMessageToThread, runAssistant } from '../api/openai'

const EVALUATIONS_ASSISTANT_ID = 'asst_7eZS5TSIGAp3v9C5EB4xA27z';

export const evaluateDecision = async (decisionText: string): Promise<[Error] | [undefined, string]> => {
    const assistant = await retrieveAssistant(EVALUATIONS_ASSISTANT_ID);
    const thread = await createThread();
    const userMessageText = `${decisionText}`;
    await addMessageToThread(thread.id, userMessageText);
    const [error, messages] = await runAssistant(thread.id, assistant.id);

    if (error) {
        return [error];
    }

    const assistantResponse = messages[messages.length - 1].content[0];

    if (assistantResponse.type === 'text') {
        const evaluation = assistantResponse.text.value
        return [undefined, evaluation];
    } else {
        return [new Error('Unexpected assistant response type')];
    }
}
