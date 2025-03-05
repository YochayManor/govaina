const DB_HOST = 'http://localhost:9000'

export const checkForExistingAnalyzation = async (decisionNumber: number): Promise<[Error] | [null, string | null]> => {
    const response = await fetch(`${DB_HOST}/analyzations/${decisionNumber}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })

    if (response.status === 200) {
        return [null, await response.text() || null]
    }
    else {
        return [new Error('Something wrong happened when checking for existing analyzation')]
    }
}
