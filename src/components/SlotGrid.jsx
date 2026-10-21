import Slot from './Slot'

function SlotGrid({ slots, onSlotClick, onSlotRemove }) {
  return (
    <div className="slot-grid">
      {slots.map((anime, i) => (
        <Slot
          key={i}
          index={i}
          anime={anime}
          onClick={() => onSlotClick(i)}
          onRemove={() => onSlotRemove(i)}
        />
      ))}
    </div>
  )
}

export default SlotGrid