import './App.css'
import Navigation from './components/Navigation';
import QuizSitePage from './pages/QuizSitePage';
import ListSitePage from './pages/ListSitePage';
import { useAuth } from './auth/AuthContext';
import LoginPage from './pages/LoginPage';

declare const google: any;

function App() {
  const { state } = useAuth();

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
