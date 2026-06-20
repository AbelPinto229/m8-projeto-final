import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import Home                from './pages/Home';
import Login               from './pages/Login';
import AgencyDashboard     from './pages/AgencyDashboard';
import ClientDashboard     from './pages/ClientDashboard';
import ClientProjectSelect from './pages/ClientProjectSelect';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/"                        element={<Home />} />
          <Route path="/login"                   element={<Login />} />
          <Route path="/agencia"                 element={<AgencyDashboard />} />
          <Route path="/agencia/cliente/:id"     element={<AgencyDashboard />} />
          <Route path="/meus-projetos"            element={<ClientProjectSelect />} />
          <Route path="/cliente/:id"             element={<ClientDashboard />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
