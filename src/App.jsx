import { useState } from 'react'
import SlotGrid from './components/SlotGrid'
import SearchModal from './components/SearchModal'
import CardPreview from './components/CardPreview'
import './App.css'

function App() {
  const [slots, setSlots] = useState([null, null, null, null, null])
  const [editingIndex, setEditingIndex] = useState(null)
  const [showPreview, setShowPreview] = useState(false)

  const handleSelect = (anime) => {
    setSlots((prev) => prev.map((s, i) => (i === editingIndex ? anime : s)))
    setEditingIndex(null)
  }

  const handleRemove = (index) => {
    setSlots((prev) => prev.map((s, i) => (i === index ? null : s)))
  }

  const selectedIds = slots.filter(Boolean).map((a) => a.id)
  const filledCount = selectedIds.length
  const isComplete = filledCount === 5

  return (
    <main className="app">
      <header className="hero">
        <p className="eyebrow">MY FAVORITE ANIME</p>
        <h1>アニメ5選</h1>
        <p className="lead">
          好きなアニメを5つ選んで、シェアしたくなる1枚のカードをつくろう。
        </p>
      </header>

      <div className="progress">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${filledCount * 20}%` }} />
        </div>
        <span className="progress-text">{filledCount} / 5</span>
      </div>

      <SlotGrid
        slots={slots}
        onSlotClick={setEditingIndex}
        onSlotRemove={handleRemove}
      />

      <div className="actions">
        <button
          className="create-button"
          disabled={!isComplete}
          onClick={() => setShowPreview(true)}
        >
          {isComplete ? 'カードを作る' : `あと${5 - filledCount}作品`}
        </button>
      </div>

      <footer className="footer">
        <p>
          Anime data provided by{' '}
          <a href="https://anilist.co" target="_blank" rel="noopener noreferrer">
            AniList
          </a>
        </p>
      </footer>

      {editingIndex !== null && (
        <SearchModal
          selectedIds={selectedIds}
          onSelect={handleSelect}
          onClose={() => setEditingIndex(null)}
        />
      )}

      {showPreview && (
        <CardPreview slots={slots} onClose={() => setShowPreview(false)} />
      )}
    </main>
  )
}

export default App