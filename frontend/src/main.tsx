import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { enGB } from 'date-fns/locale';
import './index.css'
import App from './App.tsx'

async function enableMocking() {
  if (import.meta.env.VITE_ENABLE_MSW !== 'true') {
    return;
  }

  const { worker } = await import('./mock/browser.tsx');

  return worker.start({
    serviceWorker: {
      url: '/senns-fortress/mockServiceWorker.js'
    }
  })
}

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enGB}>
        <GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID}>
          <App />
        </GoogleOAuthProvider>
      </LocalizationProvider>
    </StrictMode>,
  )
});