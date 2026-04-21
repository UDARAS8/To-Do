import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Login from './pages/login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'

 
createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <Register/> */}
    {/* <Login/> */}
    <Dashboard />
  </StrictMode>,
)