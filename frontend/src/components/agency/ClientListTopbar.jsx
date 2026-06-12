export default function ClientListTopbar({ search, setSearch, filter, setFilter, onNewClient }) {
  return (
    <div className="clients-page__topbar">
      <input
        className="clients-search"
        type="text"
        placeholder="Pesquisar projetos..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
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
      <button className="btn-new" onClick={onNewClient}>+ Novo Projeto</button>
    </div>
  );
}
