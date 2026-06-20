import { createContext, useContext, useState } from 'react';

// contexto global — disponibiliza user, login e logout em toda a app
const AuthContext = createContext(null);

// envolve toda a app no App.jsx — o children é todas as páginas e componentes
export function AuthProvider({ children }) {

  // quando a app abre, verifica se já existe um user no localStorage
  // assim se o utilizador fizer refresh na página não perde a sessão
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });

  // chamada pelo Login.jsx após login com sucesso
  // guarda o token e os dados do utilizador no localStorage e atualiza o estado do React
  function login(token, userData) {
    localStorage.setItem('token', token);                   
    localStorage.setItem('user', JSON.stringify(userData)); 
    setUser(userData);                                       
  }

  // remove tudo do localStorage e limpa o estado — utilizador fica sem sessão
  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }

  // disponibiliza user, login e logout para todos os componentes dentro do Provider
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// hook para aceder ao contexto em qualquer componente
export function useAuth() {
  return useContext(AuthContext);
}
