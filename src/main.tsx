import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './brand.css'
import App from './App.tsx'
import { injectGlossaryJsonLd } from './seo'

injectGlossaryJsonLd()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
