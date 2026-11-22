import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Same design system as the public website (copied from landingpage/src/index.css).
import './index.css'
// Staff-only adjustments on top of it.
import './staff.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
