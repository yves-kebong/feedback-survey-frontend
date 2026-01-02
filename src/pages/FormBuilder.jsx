import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function FormBuilder() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Add a new question
  const addQuestion = () => {
    const newQuestion = {
      id: Date.now(), // temporary ID
      type: 'short-answer',
      text: '',
      required: false,
      options: [] // for multiple-choice
    }
    setQuestions([...questions, newQuestion])
  }

  // Update question
  const updateQuestion = (id, field, value) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, [field]: value } : q
    ))
  }

  // Remove question
  const removeQuestion = (id) => {
    setQuestions(questions.filter(q => q.id !== id))
  }

  // Save form
  const handleSave = async () => {
    if (!title.trim()) {
      setError('Please enter a survey title')
      return
    }

    if (questions.length === 0) {
      setError('Please add at least one question')
      return
    }

    setLoading(true)
    setError('')

    try {
      const token = localStorage.getItem('token')
      
      const response = await axios.post(
        'http://localhost:5000/api/forms',
        {
          title,
          description,
          questions: questions.map((q, index) => ({
            type: q.type,
            text: q.text,
            required: q.required,
            options: q.type === 'multiple-choice' ? q.options : undefined,
            order: index
          }))
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      alert('Survey created successfully!')
      navigate('/dashboard')
      
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create survey')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '1.5rem 2rem',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem' }}>
          ✏️ Create New Survey
        </h1>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
        
        {/* Error Message */}
        {error && (
          <div style={{
            padding: '1rem',
            background: '#fee',
            color: '#c33',
            borderRadius: '5px',
            marginBottom: '1rem'
          }}>
            {error}
          </div>
        )}

        {/* Form Details */}
        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          marginBottom: '1.5rem'
        }}>
          <h2 style={{ margin: '0 0 1.5rem 0', color: '#333' }}>
            Survey Details
          </h2>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#555' }}>
              Title *
            </label>
            <input
              type="text"
              placeholder="e.g., Customer Satisfaction Survey"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '5px',
                fontSize: '1rem'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#555' }}>
              Description (optional)
            </label>
            <textarea
              placeholder="e.g., Help us improve our service by answering a few questions"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '5px',
                fontSize: '1rem',
                resize: 'vertical'
              }}
            />
          </div>
        </div>

        {/* Questions */}
        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          marginBottom: '1.5rem'
        }}>
          <h2 style={{ margin: '0 0 1.5rem 0', color: '#333' }}>
            Questions
          </h2>

          {questions.length === 0 && (
            <p style={{ color: '#999', textAlign: 'center', padding: '2rem 0' }}>
              No questions yet. Click "Add Question" to get started!
            </p>
          )}

          {questions.map((question, index) => (
            <div key={question.id} style={{
              border: '2px solid #eee',
              padding: '1.5rem',
              borderRadius: '8px',
              marginBottom: '1rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0, color: '#667eea' }}>
                  Question {index + 1}
                </h3>
                <button
                  onClick={() => removeQuestion(question.id)}
                  style={{
                    padding: '0.5rem 1rem',
                    background: '#fee',
                    color: '#c33',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '0.9rem'
                  }}
                >
                  Remove
                </button>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#555' }}>
                  Question Type
                </label>
                <select
                  value={question.type}
                  onChange={(e) => updateQuestion(question.id, 'type', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                    fontSize: '1rem'
                  }}
                >
                  <option value="short-answer">Short Answer</option>
                  <option value="long-answer">Long Answer</option>
                  <option value="multiple-choice">Multiple Choice</option>
                </select>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#555' }}>
                  Question Text
                </label>
                <input
                  type="text"
                  placeholder="Enter your question"
                  value={question.text}
                  onChange={(e) => updateQuestion(question.id, 'text', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                    fontSize: '1rem'
                  }}
                />
              </div>

              {question.type === 'multiple-choice' && (
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#555' }}>
                    Options (comma-separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Excellent, Good, Fair, Poor"
                    value={question.options.join(', ')}
                    onChange={(e) => {
                      const options = e.target.value.split(',').map(o => o.trim()).filter(o => o)
                      updateQuestion(question.id, 'options', options)
                    }}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #ddd',
                      borderRadius: '5px',
                      fontSize: '1rem'
                    }}
                  />
                </div>
              )}

              <div>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={question.required}
                    onChange={(e) => updateQuestion(question.id, 'required', e.target.checked)}
                    style={{ marginRight: '0.5rem' }}
                  />
                  <span style={{ color: '#555' }}>Required question</span>
                </label>
              </div>
            </div>
          ))}

          <button
            onClick={addQuestion}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'white',
              color: '#667eea',
              border: '2px solid #667eea',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '1rem',
              width: '100%'
            }}
          >
            ➕ Add Question
          </button>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              flex: 1,
              padding: '0.75rem',
              background: '#eee',
              color: '#666',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '1rem'
            }}
          >
            Cancel
          </button>
          
          <button
            onClick={handleSave}
            disabled={loading}
            style={{
              flex: 1,
              padding: '0.75rem',
              background: loading ? '#999' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              fontSize: '1rem'
            }}
          >
            {loading ? 'Saving...' : 'Save Survey'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default FormBuilder