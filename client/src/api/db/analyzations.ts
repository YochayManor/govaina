import { catchError } from "../common/errorHandler"

const DB_HOST = 'http://localhost:9000'

export const checkForExistingAnalyzation = async (decisionNumber: number): Promise<[Error] | [undefined, string | null]> => {
    const [error, response] = await catchError(fetch(`${DB_HOST}/analyzations/${decisionNumber}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }))

    if (error) {
        return [error] // TODO: handle error
    }

    if (response.status === 200) {
        return [undefined, await response.text() || null]
    }
    else {
        return [new Error('Something wrong happened when checking for existing analyzation')]
    }
}
