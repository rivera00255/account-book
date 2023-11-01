import { useLocation, useNavigate } from 'react-router-dom';
import { auth } from '../../lib/firebase';
import { signOut } from 'firebase/auth';

const mainNav = [
  { id: 1, path: '/accountbook', route: '가계부' },
  { id: 2, path: '/calendar', route: '캘린더' },
];

const Header = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <header className="container xl mx-auto py-5 relative">
      <h1 className="text-center font-mono font-bold text-lg">Account Book</h1>
      {sessionStorage.getItem('uid') && (
        <nav className="absolute top-4 right-0 flex flex-col items-end">
          <button
            onClick={() => {
              signOut(auth);
              sessionStorage.removeItem('uid');
              navigate('/');
            }}
            className="text-sm text-gray-500 hover:underline">
            로그아웃
          </button>
          {mainNav.map(
            (item) =>
              item.path !== pathname && (
                <button
                  key={item.id}
                  className="text-sm text-gray-700 mt-1 hover:font-medium"
                  onClick={() => navigate(`../${item.path}`)}>
                  {item.route} 보기 →
                </button>
              )
          )}
        </nav>
      )}
    </header>
  );
};

export default Header;
