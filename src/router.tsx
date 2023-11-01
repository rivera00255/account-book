import { Navigate, createBrowserRouter } from 'react-router-dom';
import App from './App';
import Home from './pages';
import AccountBook from './pages/accountbook';
import { auth } from './lib/firebase';
import Calendar from './pages/calendar';

const AuthRoute = ({ children }: { children: JSX.Element }) => {
  const user = auth.currentUser;
  if (!user) return <Navigate to="/" replace={true} />;
  return children;
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/accountbook', element: <AccountBook /> },
      { path: '/calendar', element: <Calendar /> },
    ],
  },
]);

export default router;
