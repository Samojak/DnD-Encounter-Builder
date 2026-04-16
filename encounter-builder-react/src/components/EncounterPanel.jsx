function formatCr(cr) {
  if (cr === 0.125) return "1/8";
  if (cr === 0.25) return "1/4";
  if (cr === 0.5) return "1/2";
  return Number.isInteger(cr) ? String(cr) : Number(cr).toFixed(2).replace(/\.00$/, "").replace(/0$/, "");
}

function getDifficultyClass(difficulty) {
  switch (difficulty) {
    case "Easy":
      return "difficulty-easy";
    case "Medium":
      return "difficulty-medium";
    case "Hard":
      return "difficulty-hard";
    case "Deadly":
      return "difficulty-deadly";
    default:
      return "difficulty-default";
  }
}

export default function EncounterPanel({
  selectedMonsters,
  calculationResult,
  openMonsterDetails,
  decreaseQuantity,
  increaseQuantity,
  removeMonster,
  clearEncounter,
}) {
  return (
    <>
      <div className="encounter-board-header">
        <h2>Encounter</h2>
        {calculationResult && (
          <span className={`difficulty-badge ${getDifficultyClass(calculationResult.difficulty)}`}>
            {calculationResult.difficulty}
          </span>
        )}
      </div>

      <div className="encounter-board-body">
        {selectedMonsters.length === 0 ? (
          <div className="encounter-empty-state"><p className="muted-text setup-empty-text">No monsters added yet.</p></div>
        ) : (
          <div className="encounter-list">
            {selectedMonsters.map((selected) => (
              <div className="encounter-item" key={selected.monsterId}>
                <div className="encounter-item-info">
                  <strong className="monster-name-link" onClick={() => openMonsterDetails(selected.monsterId)}>{selected.name}</strong>
                  <div className="muted-text">CR {formatCr(selected.challengeRating)}, XP {selected.xp} each</div>
                  <div className="muted-text">Subtotal XP: {selected.xp * selected.quantity}</div>
                </div>

                <div className="encounter-controls">
                  <button type="button" className="qty-btn" onClick={() => decreaseQuantity(selected.monsterId)}>-</button>
                  <span className="qty-pill">{selected.quantity}</span>
                  <button type="button" className="qty-btn" onClick={() => increaseQuantity(selected.monsterId)}>+</button>
                  <button type="button" className="remove-btn" onClick={() => removeMonster(selected.monsterId)}>Remove</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="encounter-board-footer">
        <button type="button" onClick={clearEncounter}>Clear Encounter</button>
      </div>
    </>
  );
}
