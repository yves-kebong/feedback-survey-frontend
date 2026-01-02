import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'

function Dashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [surveys, setSurveys] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')

    if (!token) {
      navigate('/login')
      return
    }

    setUser(JSON.parse(userData))

    const fetchSurveys = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/forms', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        setSurveys(response.data.data.forms)
      } catch (error) {
        console.error('Error fetching surveys:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSurveys()
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const handleDelete = async (e, surveyId, surveyTitle) => {
    e.stopPropagation()
    
    const confirmed = window.confirm(`Are you sure you want to delete "${surveyTitle}"? This action cannot be undone.`)
    
    if (!confirmed) return

    try {
      const token = localStorage.getItem('token')
      await axios.delete(`http://localhost:5000/api/forms/${surveyId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setSurveys(surveys.filter(s => s._id !== surveyId))
      alert('Survey deleted successfully!')
    } catch (error) {
      alert('Failed to delete survey. Please try again.')
      console.error('Delete error:', error)
    }
  }

  const handleToggleActive = async (e, surveyId, currentStatus) => {
    e.stopPropagation()

    try {
      const token = localStorage.getItem('token')
      await axios.patch(
        `http://localhost:5000/api/forms/${surveyId}`,
        { isActive: !currentStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      // Update UI immediately
      setSurveys(surveys.map(s => 
        s._id === surveyId ? { ...s, isActive: !currentStatus } : s
      ))
      
      alert(`Survey ${!currentStatus ? 'activated' : 'deactivated'} successfully!`)
    } catch (error) {
      alert('Failed to update survey status. Please try again.')
      console.error('Toggle error:', error)
    }
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f5f5f5'
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '1.5rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.5rem' }}>
            📋 Survey Builder
          </h1>
          <p style={{ margin: '0.25rem 0 0 0', opacity: 0.9, fontSize: '0.9rem' }}>
            Welcome back, {user.name}!
          </p>
        </div>
        
        <button
          onClick={handleLogout}
          style={{
            padding: '0.5rem 1.5rem',
            background: 'rgba(255,255,255,0.2)',
            color: 'white',
            border: '2px solid white',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '0.9rem'
          }}
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem'
      }}>
        {/* Create Survey Button */}
        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          marginBottom: '2rem',
          textAlign: 'center'
        }}>
          <h2 style={{ margin: '0 0 1rem 0', color: '#333' }}>
            Create Your First Survey
          </h2>
          <p style={{ color: '#666', marginBottom: '1.5rem' }}>
            Start collecting feedback from your audience
          </p>
          <button
            onClick={() => navigate('/form-builder')}
            style={{
              padding: '0.75rem 2rem',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 4px 10px rgba(102, 126, 234, 0.3)'
            }}
          >
            ➕ Create New Survey
          </button>
        </div>

        {/* Surveys List */}
        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 1rem 0', color: '#333' }}>
            Your Surveys
          </h3>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>
              Loading surveys...
            </div>
          ) : surveys.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '3rem 1rem',
              color: '#999'
            }}>
              <p style={{ fontSize: '3rem', margin: 0 }}>📝</p>
              <p style={{ fontSize: '1.1rem', margin: '1rem 0 0 0' }}>
                No surveys yet. Create your first one!
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {surveys.map((survey) => (
                <div 
                  key={survey._id}
                  onClick={() => navigate(`/responses/${survey._id}`)}
                  style={{
                    border: '2px solid #eee',
                    padding: '1.5rem',
                    borderRadius: '8px',
                    transition: 'all 0.2s',
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                >
                  {/* Delete Button - Top Right */}
                  <button
                    onClick={(e) => handleDelete(e, survey._id, survey.title)}
                    style={{
                      position: 'absolute',
                      top: '1rem',
                      right: '1rem',
                      padding: '0.5rem 1rem',
                      background: '#fee',
                      color: '#c33',
                      border: '1px solid #fcc',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      fontWeight: 'bold'
                    }}
                  >
                    🗑️ Delete
                  </button>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div style={{ flex: 1, paddingRight: '6rem' }}>
                      <h4 style={{ margin: '0 0 0.5rem 0', color: '#333', fontSize: '1.2rem' }}>
                        {survey.title}
                      </h4>
                      {survey.description && (
                        <p style={{ margin: '0 0 1rem 0', color: '#666', fontSize: '0.9rem' }}>
                          {survey.description}
                        </p>
                      )}
                      <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem', color: '#999', marginBottom: '1rem', alignItems: 'center' }}>
                        <span>📝 {survey.questions?.length || 0} questions</span>
                        <span>📊 {survey.responseCount || 0} responses</span>
                        
                        {/* Status with Toggle Button */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ 
                            color: survey.isActive ? '#4caf50' : '#999',
                            fontWeight: 'bold'
                          }}>
                            {survey.isActive ? '● Active' : '○ Inactive'}
                          </span>
                          <button
                            onClick={(e) => handleToggleActive(e, survey._id, survey.isActive)}
                            style={{
                              padding: '0.25rem 0.75rem',
                              background: survey.isActive ? '#fef3c7' : '#d1fae5',
                              color: survey.isActive ? '#92400e' : '#065f46',
                              border: survey.isActive ? '1px solid #fbbf24' : '1px solid #34d399',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '0.75rem',
                              fontWeight: 'bold'
                            }}
                          >
                            {survey.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                        </div>
                      </div>
                      
                      {survey.isActive && (
                        <div style={{
                          padding: '0.75rem',
                          background: '#f0f4ff',
                          borderRadius: '5px',
                          fontSize: '0.85rem'
                        }}>
                          <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center', 
                            marginBottom: '0.25rem' 
                          }}>
                            <div style={{ color: '#666' }}>Public Link:</div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                navigator.clipboard.writeText(`${window.location.origin}/survey/${survey.uniqueUrl}`)
                                alert('Link copied to clipboard!')
                              }}
                              style={{
                                padding: '0.25rem 0.75rem',
                                background: '#667eea',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '0.75rem',
                                fontWeight: 'bold'
                              }}
                            >
                              📋 Copy
                            </button>
                          </div>
                          <a
                            href={`/survey/${survey.uniqueUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            style={{
                              color: '#667eea',
                              textDecoration: 'none',
                              fontWeight: 'bold',
                              wordBreak: 'break-all'
                            }}
                          >
                            {window.location.origin}/survey/{survey.uniqueUrl}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard