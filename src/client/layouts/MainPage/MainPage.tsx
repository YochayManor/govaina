import { useState } from 'react'
import Textarea from '@mui/joy/Textarea'
import Input from '@mui/joy/Input'

import { evaluate } from '../../api/backend/evaluations'
import EvaluationSection from '../../EvaluationSection/EvaluationSection'

import './MainPage.css'

function MainPage() {
  const [decisionNumber, setDecisionNumber] = useState<number>(0)
  const [decisionText, setDecisionText] = useState<string>('')
  const [analyzationResult, setEvaluationResult] = useState<string>('')
  const [error, setError] = useState<string>('')

  const handleDecisionNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDecisionNumber(parseInt(event.target.value))
  }
  const handleDecisionTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDecisionText(event.target.value)
  }

  const sendToEvaluation = async () => {
    console.log('Evaluating...')

    const [err2, responseText] = await evaluate(decisionNumber, decisionText)
    
    if (err2) {
      setError(err2.toString())
    } else {
      setEvaluationResult(responseText)
    }
  }

  return (
    <div className='main-page'>
      <h1>גוביינה - מנתח ההחלטות הממשלתיות</h1>
      <h2>מבית המרכז להעצמת האזרח</h2>
      <div className="inputs-form">
        <label>מספר ההחלטה</label>
        <Input className='decision-number-input' type='number' onChange={handleDecisionNumberChange} />
        <label>תוכן ההחלטה</label>
        <Textarea
          className='decision-text-input'
          value={decisionText}
          onChange={handleDecisionTextChange} 
          placeholder="הדביקו כאן את תוכן ההחלטה"
          minRows={4}
        />
        <button className='analyze-button' onClick={sendToEvaluation}>Analyze</button>
      </div>
      {analyzationResult && <EvaluationSection text={analyzationResult} />}
      {error && <p>{error}</p>}
    </div>
  )
}

export default MainPage
