import Login from '../components/Login';
import WalletImg from '../assets/images/wallet.svg';
import { useContext } from 'react';
import { AuthContext } from '../utilities/AuthProvider';

const Home = () => {
  const user = useContext(AuthContext);

  return (
    <main className="container xl mx-auto">
      <div className="w-full h-full flex flex-col items-center justify-center pb-10">
        {!user.uid && <Login />}
        <img
          src={WalletImg}
          alt="wallet"
          width={!user.uid ? '320px' : '520px'}
          height={!user.uid ? '320px' : '520px'}
          className="opacity-80"
        />
      </div>
    </main>
  );
};

export default Home;
