import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Home from './pages';
import AccountBook from './pages/accountbook';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/accountbook', element: <AccountBook /> },
    ],
  },
]);

export default router;
