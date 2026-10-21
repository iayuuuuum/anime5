function Slot({ index, anime, onClick, onRemove }) {
  const number = String(index + 1).padStart(2, '0')

  return (
    <div className="slot-wrap">
      <button
        className={anime ? 'slot filled' : 'slot'}
        onClick={onClick}
        aria-label={
          anime ? `${anime.title}を変更` : `${index + 1}番目の作品を選ぶ`
        }
      >
        {anime ? (
          <>
            <img src={anime.image} alt={anime.title} />
            <span className="slot-title">{anime.title}</span>
          </>
        ) : (
          <>
            <span className="slot-plus">＋</span>
            <span className="slot-label">作品を選ぶ</span>
          </>
        )}
        <span className="slot-number">{number}</span>
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