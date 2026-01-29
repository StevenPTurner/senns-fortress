import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { enGB } from 'date-fns/locale';
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enGB}>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID}>
        <App />
      </GoogleOAuthProvider>
    </LocalizationProvider>
  </StrictMode>,
)
