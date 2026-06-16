// barra de ferramentas no topo da lista de clientes com pesquisa, filtros e botão de novo projeto
export default function ClientListTopbar({ search, setSearch, filter, setFilter, onNewClient }) {
  return (
    <div className="clients-page__topbar">
      {/* campo de pesquisa por nome do projeto */}
      <input
        className="clients-search"
        type="text"
        placeholder="Pesquisar projetos..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {/* botões de filtro — todos / ativo / inativo */}
      <div className="clients-filters">
        {['todos', 'ativo', 'inativo'].map((f) => (
          <button
            key={f}
            className={`clients-filter-btn ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>
      {/* abre o drawer de criação de novo cliente */}
      <button className="btn-new" onClick={onNewClient}>+ Novo Projeto</button>
    </div>
  );
}
