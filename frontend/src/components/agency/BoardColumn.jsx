import { Droppable, Draggable } from '@hello-pangea/dnd';

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
      <Droppable droppableId={col.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`board__droppable ${snapshot.isDraggingOver ? 'board__droppable--over' : ''}`}
          >
            {col.items.map((card, index) => (
              <Draggable key={card.id} draggableId={String(card.id)} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`board__card ${snapshot.isDragging ? 'board__card--dragging' : ''}`}
                    onClick={() => handleCardClick(card)}
                  >
                    <h3>{card.title}</h3>
                    <span className="board__card__tag">{card.social_network}</span>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
