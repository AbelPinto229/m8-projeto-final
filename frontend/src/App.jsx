import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AgencyDashboard from './pages/AgencyDashboard';
import ClientDashboard from './pages/ClientDashboard';
function App() {
  return (
    <BrowserRouter>
      <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/agencia" element={<AgencyDashboard />} />
            <Route path="/agencia/cliente/:id" element={<AgencyDashboard />} />
            <Route path="/cliente/:id" element={<ClientDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;