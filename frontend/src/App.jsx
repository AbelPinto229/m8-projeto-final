import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AgencyDashboard from './pages/AgencyDashboard';
import ClientDashboard from './pages/ClientDashboard';
import ReportsPage from './pages/ReportPage';
import './styles/App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <main className="app__main">
          <Routes>
            <Route path="/agencia" element={<AgencyDashboard />} />
            <Route path="/agencia/cliente/:id" element={<AgencyDashboard />} />
            <Route path="/cliente/:id" element={<ClientDashboard />} />
            <Route path="/agencia/relatorios" element={<ReportsPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;