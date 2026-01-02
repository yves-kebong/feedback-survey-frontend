import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

function PublicForm() {
  const { uniqueUrl } = useParams() // Get the survey URL from the address bar
  const [form, setForm] = useState(null)
  const [answers, setAnswers] = useState({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  // Load the form when page opens
  useEffect(() => {
    const fetchForm = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/public/forms/${uniqueUrl}`)
        setForm(response.data.data.form)
      } catch (err) {
        setError('Survey not found or is not active')
      } finally {
        setLoading(false)
      }
    }

    fetchForm()
  }, [uniqueUrl])

  // Update answer when user types
  const handleAnswerChange = (questionId, value) => {
    setAnswers({
      ...answers,
      [questionId]: value
    })
  }

  // Submit the form
  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      // Convert answers object to array format backend expects
      const answersArray = Object.keys(answers).map(questionId => ({
        questionId,
        answer: answers[questionId]
      }))

      await axios.post(`http://localhost:5000/api/public/forms/${uniqueUrl}/responses`, {
        answers: answersArray
      })

      setSuccess(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit response')
    } finally {
      setSubmitting(false)
    }
  }

  // Show loading
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f5f5f5'
      }}>
        <div style={{ textAlign: 'center', color: '#666' }}>
          <p style={{ fontSize: '2rem' }}>📋</p>
          <p>Loading survey...</p>
        </div>
      </div>
    )
  }

  // Show error
  if (error && !form) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f5f5f5'
      }}>
        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          textAlign: 'center',
          maxWidth: '400px'
        }}>
          <p style={{ fontSize: '3rem', margin: 0 }}>❌</p>
          <h2 style={{ color: '#c33', margin: '1rem 0' }}>Survey Not Found</h2>
          <p style={{ color: '#666' }}>{error}</p>
        </div>
      </div>
    )
  }

  // Show success message
  if (success) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{
          background: 'white',
          padding: '3rem',
          borderRadius: '10px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          textAlign: 'center',
          maxWidth: '400px'
        }}>
          <p style={{ fontSize: '4rem', margin: 0 }}>✅</p>
          <h2 style={{ color: '#4caf50', margin: '1rem 0' }}>Thank You!</h2>
          <p style={{ color: '#666', fontSize: '1.1rem' }}>
            Your response has been submitted successfully.
          </p>
        </div>
      </div>
    )
  }

  // Show the form
  return (
    <div style={{
      minHeight: '100vh',
      background: '#f5f5f5',
      padding: '2rem 1rem'
    }}>
      <div style={{
        maxWidth: '700px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '2rem',
          borderRadius: '10px 10px 0 0',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem' }}>
            {form.title}
          </h1>
          {form.description && (
            <p style={{ margin: 0, opacity: 0.9, fontSize: '1.1rem' }}>
              {form.description}
            </p>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '0 0 10px 10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          {error && (
            <div style={{
              padding: '1rem',
              background: '#fee',
              color: '#c33',
              borderRadius: '5px',
              marginBottom: '1.5rem'
            }}>
              {error}
            </div>
          )}

          {/* Questions */}
          {form.questions.map((question, index) => (
            <div key={question.questionId} style={{ marginBottom: '2rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.75rem',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                color: '#333'
              }}>
                {index + 1}. {question.text}
                {question.required && <span style={{ color: '#c33' }}> *</span>}
              </label>

              {/* Short Answer */}
              {question.type === 'short-answer' && (
                <input
                  type="text"
                  required={question.required}
                  value={answers[question.questionId] || ''}
                  onChange={(e) => handleAnswerChange(question.questionId, e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                    fontSize: '1rem'
                  }}
                  placeholder="Your answer"
                />
              )}

              {/* Long Answer */}
              {question.type === 'long-answer' && (
                <textarea
                  required={question.required}
                  value={answers[question.questionId] || ''}
                  onChange={(e) => handleAnswerChange(question.questionId, e.target.value)}
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                    fontSize: '1rem',
                    resize: 'vertical'
                  }}
                  placeholder="Your answer"
                />
              )}

              {/* Multiple Choice */}
              {question.type === 'multiple-choice' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {question.options.map((option, optIndex) => (
                    <label
                      key={optIndex}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0.75rem',
                        border: '2px solid #eee',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        background: answers[question.questionId] === option ? '#f0f4ff' : 'white',
                        borderColor: answers[question.questionId] === option ? '#667eea' : '#eee'
                      }}
                    >
                      <input
                        type="radio"
                        name={question.questionId}
                        value={option}
                        required={question.required}
                        checked={answers[question.questionId] === option}
                        onChange={(e) => handleAnswerChange(question.questionId, e.target.value)}
                        style={{ marginRight: '0.75rem' }}
                      />
                      <span style={{ fontSize: '1rem' }}>{option}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            style={{
              width: '100%',
              padding: '1rem',
              background: submitting ? '#999' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              cursor: submitting ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 10px rgba(102, 126, 234, 0.3)'
            }}
          >
            {submitting ? 'Submitting...' : 'Submit Response'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default PublicForm