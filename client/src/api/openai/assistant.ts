import { catchError } from "../common/errorHandler"

const SERVER_API = 'http://localhost:3001/api'

export const analyze = async (decisionNumber: number, decisionText: string): Promise<[Error] | [undefined, string]> => {
  const [error, response] = await catchError(fetch(`${SERVER_API}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ decisionNumber, decisionText })
  }));

  if (error) {
    return [error] // TODO: handle error
  }

  const evaluationText = await response.text();
  console.log(evaluationText);
  
  return [undefined, evaluationText]
}
