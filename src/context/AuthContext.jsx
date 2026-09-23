import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('mf_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) localStorage.setItem('mf_user', JSON.stringify(user));
    else localStorage.removeItem('mf_user');
  }, [user]);

  const login = async (email, password) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800)); // simulate API
    if (!email || !password) {
      setLoading(false);
      throw new Error('Email and password required');
    }
    const userData = {
      id: Date.now(),
      name: email.split('@')[0],
      email
    };
    setUser(userData);
    setLoading(false);
    return userData;
  };

  const signup = async (name, email, password) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    if (!name || !email || !password) {
      setLoading(false);
      throw new Error('All fields required');
    }
    const userData = { id: Date.now(), name, email };
    setUser(userData);
    setLoading(false);
    return userData;
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);