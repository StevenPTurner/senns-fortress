import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { enGB } from 'date-fns/locale';
import './index.css'
import App from './App.tsx'
import AuthProvider from './auth/authContext.tsx';
import env from './lib/EnvReader.tsx';

async function enableMocking() {
  if (env.get('DATA_MODE') !== 'MOCK') {
    return;
  }

  const { worker } = await import('./mock/browser.tsx');

  return worker.start({
    serviceWorker: {
      url: '/mockServiceWorker.js'
    }
  })
}

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enGB}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </LocalizationProvider>
    </StrictMode>,
  )
});