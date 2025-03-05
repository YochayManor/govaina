const OPENAI_HOST = 'http://localhost:8000/analyze'

export const analyze = async (decisionNumber: number, decisionText: string): Promise<[Error] | [null, string]> => {
  const response = await fetch(OPENAI_HOST, {
    method: 'POST',
    body: JSON.stringify({ decisionNumber, decisionText }),
    headers: {
      'Content-Type': 'application/json'
    }
  })

  if (response.status === 200) {
    return [null, await response.text()]
  }
  else {
    return [new Error('Failed to analyze decision')]
  }
}
