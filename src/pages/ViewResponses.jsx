import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

function ViewResponses() {
  const { formId } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState(null)
  const [responses, setResponses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token')
        const [formRes, responsesRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/forms/${formId}`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`http://localhost:5000/api/forms/${formId}/responses`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ])
        setForm(formRes.data.data.form)
        setResponses(responsesRes.data.data.responses)
      } catch (err) {
        setError('Failed to load data. Please check your connection or login.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [formId])

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' }}>
      <div style={{ textAlign: 'center' }}><p style={{ fontSize: '2rem' }}>📊</p><p>Loading...</p></div>
    </div>
  )

  if (error) return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <p style={{ color: 'red' }}>{error}</p>
      <button onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', paddingBottom: '4rem' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '1.5rem 2rem' }}>
        <button onClick={() => navigate('/dashboard')} style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid white', padding: '0.4rem 1rem', borderRadius: '4px', cursor: 'pointer', marginBottom: '1rem' }}>
          ← Back
        </button>
        <h1 style={{ margin: 0 }}>📊 {form?.title}</h1>
        <p style={{ margin: '0.5rem 0 0 0', opacity: 0.8 }}>{responses.length} total responses</p>
      </div>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem' }}>
        {responses.length === 0 ? (
          /* EMPTY STATE */
          <div style={{ background: 'white', padding: '4rem', borderRadius: '12px', textAlign: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <p style={{ fontSize: '3rem', margin: 0 }}>📭</p>
            <h2 style={{ color: '#333' }}>No responses yet</h2>
          </div>
        ) : (
          <>
            {/* 1. QUICK STATS SECTION */}
            <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '2rem' }}>
              <h2 style={{ marginTop: 0, borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>Quick Stats</h2>
              {form.questions
                .filter(q => q.type === 'multiple-choice')
                .map(question => {
                  const questionAnswers = responses
                    .map(r => r.answers.find(a => a.questionId === question.questionId))
                    .filter(a => a && a.answer)

                  const counts = {}
                  questionAnswers.forEach(ans => { counts[ans.answer] = (counts[ans.answer] || 0) + 1 })

                  return (
                    <div key={question.questionId} style={{ marginBottom: '2rem' }}>
                      <h4 style={{ color: '#667eea', marginBottom: '0.5rem' }}>{question.text}</h4>
                      {Object.entries(counts).map(([option, count]) => {
                        const percentage = ((count / (questionAnswers.length || 1)) * 100).toFixed(0)
                        return (
                          <div key={option} style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                            <div style={{ width: '120px', fontSize: '0.85rem' }}>{option}</div>
                            <div style={{ flex: 1, height: '12px', background: '#eee', borderRadius: '6px', overflow: 'hidden' }}>
                              <div style={{ width: `${percentage}%`, height: '100%', background: '#667eea', transition: 'width 0.5s' }} />
                            </div>
                            <div style={{ width: '60px', fontSize: '0.85rem', fontWeight: 'bold' }}>{percentage}%</div>
                          </div>
                        )
                      })}
                    </div>
                  )
                })}
            </div>

            {/* 2. INDIVIDUAL RESPONSES SECTION */}
            <h2 style={{ marginBottom: '1rem' }}>All Submissions</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {[...responses].reverse().map((response, idx) => (
                <div key={response._id} style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', paddingBottom: '1rem', marginBottom: '1rem' }}>
                    <strong style={{ color: '#764ba2' }}>Submission #{responses.length - idx}</strong>
                    <small style={{ color: '#999' }}>{new Date(response.submittedAt).toLocaleString()}</small>
                  </div>
                  {response.answers.map(ans => {
                    const qText = form.questions.find(q => q.questionId === ans.questionId)?.text
                    return (
                      <div key={ans.questionId} style={{ marginBottom: '1rem' }}>
                        <div style={{ fontSize: '0.8rem', color: '#888', fontWeight: 'bold' }}>{qText || 'Question'}</div>
                        <div style={{ padding: '0.5rem', background: '#f9f9f9', borderRadius: '4px', marginTop: '0.2rem' }}>{ans.answer || '(Empty)'}</div>
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default ViewResponses