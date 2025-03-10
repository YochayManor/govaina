import './EvaluationSection.css'

function EvaluationSection({ text }: { text: string }) {

  return (
    <div className='eval-section'>
			<div className='eval-result'>
				<h2>תוצאה</h2>
				<p>{text}</p>
			</div>
    </div>
  )
}

export default EvaluationSection
