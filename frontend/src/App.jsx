// define todas as rotas da aplicação
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AgencyDashboard from './pages/AgencyDashboard';
import ClientDashboard from './pages/ClientDashboard';
function App() {
  return (
    <BrowserRouter>
      <Routes>
            {/* página inicial pública */}
            <Route path="/" element={<Home />} />
            {/* dashboard da agência — lista de clientes */}
            <Route path="/agencia" element={<AgencyDashboard />} />
            {/* dashboard da agência com um cliente específico aberto no kanban */}
            <Route path="/agencia/cliente/:id" element={<AgencyDashboard />} />
            {/* dashboard do cliente — acesso por id */}
            <Route path="/cliente/:id" element={<ClientDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;