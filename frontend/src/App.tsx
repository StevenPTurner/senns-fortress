import './App.css'
import { useAuth } from './auth/AuthContext';
import Navigation from './components/Navigation';
import QuizSitePage from './pages/QuizSitePage';
import ListSitePage from './pages/ListSitePage';
import LoginPage from './pages/LoginPage';
import Notification from './components/Notification';

declare const google: any;

function App() {
  const { state, showLoginNotification, setShowLoginNotification } = useAuth();

  const failedContent = () => (
    <div>BAD</div>
  )

  const loginButton = () => (
    <LoginPage />
  );

  const sennsFortress = () => (
    <Navigation
      navigationTabs={[
        {
          label: 'Lists',
          index: '1',
          content: <ListSitePage />
        },
        {
          label: 'Quiz',
          index: '2',
          content: <QuizSitePage />
        }
      ]}
    />
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
