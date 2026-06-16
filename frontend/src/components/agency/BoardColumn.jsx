export default function BoardColumn({ col, handleCardClick }) {
  return (
    <div className="board__column">
      <div className="board__column-header">
        <div className="board__column-header-left">
          <span className={`board__column-dot ${col.dot}`}></span>
          <h2>{col.label}</h2>
        </div>
        <span className="board__column-count">{col.items.length}</span>
      </div>
      <div className="board__droppable">
        {col.items.map((card) => (
          <div key={card.id} className="board__card" onClick={() => handleCardClick(card)}>
            <h3>{card.title}</h3>
            <span className="board__card__tag">{card.social_network}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
