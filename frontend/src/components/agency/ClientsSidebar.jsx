// sidebar lateral com resumo estatístico dos clientes e barras de progresso por estado
export default function ClientsSidebar({ totalClients, ativos, inativos }) {
  return (
    <div className="clients-sidebar">
      {/* caixa de resumo com totais */}
      <div className="sidebar-box">
        <p className="sidebar-label">RESUMO</p>
        <div className="sidebar-item">
          <span className="sidebar-dot dot-blue"></span>
          <span>Total projetos</span>
          <strong>{totalClients}</strong>
        </div>
        <div className="sidebar-item">
          <span className="sidebar-dot dot-green"></span>
          <span>Ativos</span>
          <strong>{ativos}</strong>
        </div>
        <div className="sidebar-item">
          <span className="sidebar-dot dot-gray"></span>
          <span>Inativos</span>
          <strong>{inativos}</strong>
        </div>
      </div>
      {/* caixa com barras de progresso proporcional ao total */}
      <div className="sidebar-box">
        <p className="sidebar-label">POR ESTADO</p>
        <div className="sidebar-progress">
          <div className="sidebar-progress__row"><span>Ativo</span><strong>{ativos}</strong></div>
          <div className="progress-bar">
            {/* largura calculada como percentagem do total de clientes */}
            <div className="progress-bar__fill green" style={{ width: totalClients ? `${(ativos / totalClients) * 100}%` : '0%' }}></div>
          </div>
        </div>
        <div className="sidebar-progress">
          <div className="sidebar-progress__row"><span>Inativo</span><strong>{inativos}</strong></div>
          <div className="progress-bar">
            <div className="progress-bar__fill gray" style={{ width: totalClients ? `${(inativos / totalClients) * 100}%` : '0%' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
