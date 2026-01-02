import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import FormBuilder from './pages/FormBuilder'
import PublicForm from './pages/PublicForm'
import ViewResponses from './pages/ViewResponses'

function Home() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>
          📋 Survey Builder
        </h1>
        <p style={{ fontSize: '1.5rem', opacity: 0.9 }}>
          Create, Share, and Analyze Surveys
        </p>
        
        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link to="/login" style={{
            padding: '0.75rem 2rem',
            background: 'white',
            color: '#667eea',
            textDecoration: 'none',
            borderRadius: '5px',
            fontWeight: 'bold',
            fontSize: '1rem'
          }}>
            Login
          </Link>
          
          <Link to="/register" style={{
            padding: '0.75rem 2rem',
            background: 'rgba(255,255,255,0.2)',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '5px',
            fontWeight: 'bold',
            fontSize: '1rem',
            border: '2px solid white'
          }}>
            Register
          </Link>
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/form-builder" element={<FormBuilder />} />
        <Route path="/survey/:uniqueUrl" element={<PublicForm />} />
        <Route path="/responses/:formId" element={<ViewResponses />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App