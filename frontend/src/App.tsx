import './App.css'
import { useAuth } from './auth/AuthContext';
import Navigation from './components/Navigation';
import QuizSitePage from './pages/QuizSitePage';
import ListSitePage from './pages/ListSitePage';
import LoginPage from './pages/LoginPage';
import Notification from './components/Notification';
import { Navigate, Route, Routes, useLocation } from 'react-router';
import { Box } from '@mui/material';

declare const google: any;

function App() {
  const { state, showLoginNotification, setShowLoginNotification } = useAuth();

  const navigationTabs = [{
    label: 'Lists',
    index: 0,
    link: '/list'
  },
  {
    label: 'Quiz',
    index: 1,
    link: '/quiz'
  }];

  const routeIndex: Record<string, number> = {
    '/list': 0,
    '/quiz': 1
  };

  const location = useLocation();
  const selectedTab = routeIndex[location.pathname] ?? 0;

  const failedContent = () => (
    <div>BAD</div>
  )

  const loginButton = () => (
    <LoginPage />
  );

  const sennsFortress = () => (
    <>
      <Navigation
        selectedTab={selectedTab}
        navigationTabs={navigationTabs}
      />
      <Box
        sx={{ padding: 2 }}>
        <Routes>
          <Route path="/" element={<Navigate to='/list' />} />
          <Route path="/list" element={<ListSitePage />} />
          <Route path="/quiz" element={<QuizSitePage />} />
        </Routes>
      </Box>
    </>
  );

  return (
    <>
      <Notification
        open={showLoginNotification}
        onClose={() => setShowLoginNotification(false)}
        message="Login successful!"
      />
      {state === 'FAILED_LOGIN' && (
        failedContent()
      )}

      {state === 'NOT_LOGGED_IN' && (
        loginButton()
      )}

      {state === 'LOGGED_IN' && (
        sennsFortress()
      )}
    </>
  );
}

export default App
