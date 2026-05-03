import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './css.css';
import App from './App'

const isStrict = false;

createRoot(document.getElementById('root')!).render(
  isStrict ?
    <StrictMode>
      <App />
    </StrictMode>
  : <App/>
)
