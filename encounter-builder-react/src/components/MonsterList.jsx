function formatCr(cr) {
  if (cr === 0.125) return "1/8";
  if (cr === 0.25) return "1/4";
  if (cr === 0.5) return "1/2";
  return Number.isInteger(cr) ? String(cr) : Number(cr).toFixed(2).replace(/\.00$/, "").replace(/0$/, "");
}

const crValues = ["0", "0.125", "0.25", "0.5", ...Array.from({ length: 30 }, (_, i) => String(i + 1))];

export default function MonsterList({
  partySize,
  partyLevel,
  onPartySizeChanged,
  onPartyLevelChanged,
  searchTerm,
  setSearchTerm,
  selectedSort,
  setSelectedSort,
  selectedCrFilter,
  setSelectedCrFilter,
  resetFilters,
  filteredMonsters,
  monsters,
  isLoading,
  selectedMonsters,
  addMonster,
  openMonsterDetails,
}) {
  return (
    <>
      <h2>Monsters</h2>

      <div className="monster-top-controls">
        <div className="setup-field">
          <label>Party Size</label>
          <input type="number" min="1" value={partySize} onChange={onPartySizeChanged} />
        </div>

        <div className="setup-field">
          <label>Party Level</label>
          <input type="number" min="1" max="20" value={partyLevel} onChange={onPartyLevelChanged} />
        </div>
      </div>

      <div className="monster-toolbar">
        <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search monsters..." />

        <select value={selectedSort} onChange={(e) => setSelectedSort(e.target.value)}>
          <option value="name-asc">Name A-Z</option>
          <option value="name-desc">Name Z-A</option>
          <option value="cr-asc">CR Low to High</option>
          <option value="cr-desc">CR High to Low</option>
        </select>

        <select value={selectedCrFilter} onChange={(e) => setSelectedCrFilter(e.target.value)}>
          <option value="">All CR</option>
          {crValues.map((value) => (
            <option key={value} value={value}>
              {value === "0.125" ? "1/8" : value === "0.25" ? "1/4" : value === "0.5" ? "1/2" : value}
            </option>
          ))}
        </select>

        <button type="button" onClick={resetFilters}>Reset</button>
      </div>

      <p className="monster-count-line">Showing {filteredMonsters.length} of {monsters.length} monsters</p>

      {isLoading ? (
        <p>Loading monsters...</p>
      ) : (
        <div className="monster-list">
          {filteredMonsters.map((monster) => {
            const selected = selectedMonsters.find((m) => m.monsterId === monster.id);
            return (
              <div className="monster-row" key={monster.id}>
                <div>
                  <strong className="monster-name-link" onClick={() => openMonsterDetails(monster.id)}>
                    {monster.name}
                  </strong>
                  <div className="muted-text">CR {formatCr(monster.challengeRating)}, XP {monster.xp}, {monster.type}</div>
                </div>

                <div className="monster-actions">
                  {!selected ? (
                    <button type="button" onClick={() => addMonster(monster)}>Add</button>
                  ) : (
                    <>
                      <span className="muted-text">Added x {selected.quantity}</span>
                      <button type="button" onClick={() => addMonster(monster)}>+1</button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
