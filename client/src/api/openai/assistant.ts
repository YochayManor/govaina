import { catchError } from "../common/errorHandler"

const OPENAI_HOST = 'http://localhost:8000/analyze'

export const analyze = async (decisionNumber: number, decisionText: string): Promise<[Error] | [undefined, string]> => {
  const [error, response] = await catchError(fetch(OPENAI_HOST, {
    method: 'POST',
    body: JSON.stringify({ decisionNumber, decisionText }),
    headers: {
      'Content-Type': 'application/json'
    }
  }))

  if (error) {
    return [error] // TODO: handle error
  }

  if (response.status === 200) {
    return [undefined, await response.text()]
  }
  else {
    return [new Error('Failed to analyze decision')]
  }
}
