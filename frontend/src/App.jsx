import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import Home                from './pages/Home';
import Login               from './pages/Login';
import ForgotPassword      from './pages/ForgotPassword';
import Register            from './pages/Register';
import AgencyDashboard     from './pages/AgencyDashboard';
import ClientDashboard     from './pages/ClientDashboard';
import ClientProjectSelect from './pages/ClientProjectSelect';

function AgencyRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'agency') return <Navigate to="/meus-projetos" replace />;
  return children;
}

function ClientRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'client') return <Navigate to="/agencia" replace />;
  return children;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/"                    element={<Home />} />
          <Route path="/login"               element={<Login />} />
          <Route path="/registar"            element={<Register />} />
          <Route path="/esqueci-password"    element={<ForgotPassword />} />
          <Route path="/agencia"             element={<AgencyRoute><AgencyDashboard /></AgencyRoute>} />
          <Route path="/agencia/cliente/:id" element={<AgencyRoute><AgencyDashboard /></AgencyRoute>} />
          <Route path="/meus-projetos"       element={<ClientRoute><ClientProjectSelect /></ClientRoute>} />
          <Route path="/cliente/:id"         element={<ClientRoute><ClientDashboard /></ClientRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
