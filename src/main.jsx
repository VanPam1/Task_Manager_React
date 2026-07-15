import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import TestPage from './TestPage.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TestPage />
  </StrictMode>,
)
