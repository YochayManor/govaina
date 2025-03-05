import './MainPage.css'

function MainPage() {
  const sendToAnalyze = () => {
    console.log('Analyzing...')
  }

  return (
    <div className='main-page'>
      <h1>GovAIna - Government AI decisioN Analyzer</h1>
      <div className="inputs-form">
        <label>Decision Number</label>
        <input className='decision-number-input' type='number' />
        <label>Decision text</label>
        <input className='decision-text-input' />
        <button className='analyze-button' onClick={sendToAnalyze}>Analyze</button>
      </div>
      <div className='analyzation-section'>
        <div className='analyzation-result'>
          <h2>Result</h2>
          <p>Decision text: Lorem ipsum dolor sit amet, consectetur adipiscing elit Lorem ipsum dolor sit amet, consectetur adipiscing elit Lorem ipsum dolor sit amet, consectetur adipiscing elit Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </div>
      </div>
    </div>
  )
}

export default MainPage
