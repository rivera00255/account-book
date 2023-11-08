import { Navigate, createBrowserRouter } from 'react-router-dom';
import App from './App';
import Home from './pages';
import AccountBook from './pages/accountbook';
import Calendar from './pages/calendar';
import { useContext } from 'react';
import { AuthContext } from './utilities/AuthProvider';

const AuthRoute = ({ children }: { children: JSX.Element }) => {
  const user = useContext(AuthContext);
  if (!user.uid) return <Navigate to="/" replace={true} />;
  return children;
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/', element: <Home /> },
      {
        path: '/accountbook',
        element: (
          <AuthRoute>
            <AccountBook />
          </AuthRoute>
        ),
      },
      {
        path: '/calendar',
        element: (
          <AuthRoute>
            <Calendar />
          </AuthRoute>
        ),
      },
    ],
  },
]);

export default router;
