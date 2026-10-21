function Slot({ index, anime, onClick, onRemove }) {
  return (
    <div className="slot-wrap">
      <button className="slot" onClick={onClick}>
        {anime ? (
          <>
            <img src={anime.image} alt={anime.title} />
            <span className="slot-title">{anime.title}</span>
          </>
        ) : (
          <span className="slot-empty">＋ {index + 1}</span>
        )}
      </button>

      {anime && (
        <button
          className="slot-remove"
          onClick={onRemove}
          aria-label={`${anime.title}を削除`}
        >
          ×
        </button>
      )}
    </div>
  )
}

export default Slot