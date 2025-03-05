import './AnalyzationResponseSection.css'

function AnalyzationResponseSection({ text }: { text: string }) {

  return (
    <div className='analyzation-section'>
			<div className='analyzation-result'>
				<h2>Result</h2>
				<p>{text}</p>
			</div>
    </div>
  )
}

export default AnalyzationResponseSection
