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

  // 指定した枠を空(null)に戻す
  const handleRemove = (index) => {
    setSlots((prev) => prev.map((s, i) => (i === index ? null : s)))
  }

  const selectedIds = slots.filter(Boolean).map((a) => a.id)
  const filledCount = selectedIds.length
  const isComplete = filledCount === 5

  const handleCreate = () => {
    setShowPreview(true)
  }

  return (
    <main className="app">
      <h1>アニメ5選</h1>
      <p>
        {isComplete
          ? '5作品そろいました！'
          : `好きなアニメを選んでください（あと${5 - filledCount}作品）`}
      </p>

      <SlotGrid
        slots={slots}
        onSlotClick={setEditingIndex}
        onSlotRemove={handleRemove}
      />

      <button
        className="create-button"
        disabled={!isComplete}
        onClick={handleCreate}
      >
        カードを作る
      </button>

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