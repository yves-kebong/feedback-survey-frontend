import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'

function Dashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [surveys, setSurveys] = useState([])
  const [loading, setLoading] = useState(true)
  

  useEffect(() => {
  // Check if user is logged in
  const token = localStorage.getItem('token')
  const userData = localStorage.getItem('user')

  if (!token) {
    // Not logged in, redirect to login
    navigate('/login')
    return
  }

  // Load user data
  setUser(JSON.parse(userData))

  // Fetch surveys from backend
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
        <div key={survey._id} style={{
          border: '2px solid #eee',
          padding: '1.5rem',
          borderRadius: '8px',
          transition: 'all 0.2s',
          cursor: 'pointer'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#333', fontSize: '1.2rem' }}>
                {survey.title}
              </h4>
              {survey.description && (
                <p style={{ margin: '0 0 1rem 0', color: '#666', fontSize: '0.9rem' }}>
                  {survey.description}
                </p>
              )}
              <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem', color: '#999' }}>
                <span>📝 {survey.questions?.length || 0} questions</span>
                <span>📊 {survey.responseCount || 0} responses</span>
                <span style={{ 
                  color: survey.isActive ? '#4caf50' : '#999',
                  fontWeight: 'bold'
                }}>
                  {survey.isActive ? '● Active' : '○ Inactive'}
                </span>
              </div>
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