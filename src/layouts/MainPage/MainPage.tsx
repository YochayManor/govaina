import { useState } from 'react'
import { analyze } from '../../api/openai/assistant'
import { checkForExistingAnalyzation } from '../../api/db/analyzations'
import AnalyzationResponseSection from '../../components/AnalyzationResponseSection/AnalyzationResponseSection'

import './MainPage.css'

function MainPage() {
  const [decisionNumber, setDecisionNumber] = useState<number>(0)
  const [decisionText, setDecisionText] = useState<string>('')
  const [analyzationResult, setAnalyzationResult] = useState<string>('')
  const [error, setError] = useState<string>('')

  const handleDecisionNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDecisionNumber(parseInt(event.target.value))
  }
  const handleDecisionTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDecisionText(event.target.value)
  }

  const sendToAnalyze = async () => {
    console.log('Analyzing...')
    const [err1, existingResponseText] = await checkForExistingAnalyzation(decisionNumber)

    if (err1) {
      setError(err1.toString())
      return
    } else if (existingResponseText) {
      setAnalyzationResult(existingResponseText)
      return
    }

    const [err2, responseText] = await analyze(decisionNumber, decisionText)
    
    if (err2) {
      setError(err2.toString())
    } else {
      setAnalyzationResult(responseText)
    }
  }

  return (
    <div className='main-page'>
      <h1>GovAIna - Government AI decisioN Analyzer</h1>
      <div className="inputs-form">
        <label>Decision Number</label>
        <input className='decision-number-input' type='number' onChange={handleDecisionNumberChange} />
        <label>Decision text</label>
        <input className='decision-text-input' onChange={handleDecisionTextChange} />
        <button className='analyze-button' onClick={sendToAnalyze}>Analyze</button>
      </div>
      {analyzationResult && <AnalyzationResponseSection text={analyzationResult} />}
      {error && <p>{error}</p>}
    </div>
  )
}

export default MainPage
