import { ReactNode, createContext, useEffect, useState } from 'react';
import { auth } from '../lib/firebase';
import { User, onAuthStateChanged } from 'firebase/auth';

export const AuthContext = createContext<{ uid: string | null }>({
  uid: null,
});

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user: User | null) => {
      user ? setUser(user.uid) : setUser(null);
    });
  }, []);

  return <AuthContext.Provider value={{ uid: user }}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
