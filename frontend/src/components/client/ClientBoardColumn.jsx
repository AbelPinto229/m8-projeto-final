// coluna do kanban do cliente — versão de leitura com data de publicação em cada card
export default function ClientBoardColumn({ col, handleCardClick }) {
  return (
    <div className="board__column">
      {/* cabeçalho com dot colorido, nome da coluna e contagem de itens */}
      <div className="board__column-header">
        <div className="board__column-header-left">
          <span className={`board__column-dot ${col.dot}`}></span>
          <h2>{col.label}</h2>
        </div>
        <span className="board__column-count">{col.items.length}</span>
      </div>
      {/* mensagem vazia ou lista de cards consoante existam conteúdos */}
      {col.items.length === 0
        ? <p className="client-column__empty">Sem conteúdos</p>
        : col.items.map((card) => (
            <div key={card.id} className="board-card" onClick={() => handleCardClick(card)}>
              <p className="board-card__title">{card.title}</p>
              <div className="board-card__footer">
                <span className="board__card__tag">{card.social_network}</span>
                {/* data de publicação formatada em pt-PT quando existe */}
                {card.scheduled_date && (
                  <span className="board-card__date">
                    {new Date(card.scheduled_date).toLocaleDateString('pt-PT')}
                  </span>
                )}
              </div>
            </div>
          ))
      }
    </div>
  );
}
