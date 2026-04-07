import { useEffect, useMemo, useState } from "react";
import { calculateEncounter, getMonsterDetails, getMonsters } from "./api/monsterApi";

function formatCr(cr) {
  if (cr === 0.125) return "1/8";
  if (cr === 0.25) return "1/4";
  if (cr === 0.5) return "1/2";
  return Number.isInteger(cr) ? String(cr) : Number(cr).toFixed(2).replace(/\.00$/, "").replace(/0$/, "");
}

function formatModifier(score) {
  const modifier = Math.floor((score - 10) / 2);
  return modifier >= 0 ? `+${modifier}` : String(modifier);
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

const crValues = [
  "0", "0.125", "0.25", "0.5", ...Array.from({ length: 30 }, (_, i) => String(i + 1)),
];

export default function App() {
  const [monsters, setMonsters] = useState([]);
  const [selectedMonsters, setSelectedMonsters] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSort, setSelectedSort] = useState("name-asc");
  const [selectedCrFilter, setSelectedCrFilter] = useState("");

  const [partySize, setPartySize] = useState(4);
  const [partyLevel, setPartyLevel] = useState(1);

  const [isLoading, setIsLoading] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [statusMessage, setStatusMessage] = useState("Nothing loaded yet.");

  const [calculationResult, setCalculationResult] = useState(null);

  const [isMonsterDetailsOpen, setIsMonsterDetailsOpen] = useState(false);
  const [isLoadingMonsterDetails, setIsLoadingMonsterDetails] = useState(false);
  const [isMonsterImageLoaded, setIsMonsterImageLoaded] = useState(false);
  const [selectedMonsterDetails, setSelectedMonsterDetails] = useState(null);

  useEffect(() => {
    async function loadMonsters() {
      try {
        setIsLoading(true);
        setStatusMessage("Loading monsters...");
        const data = await getMonsters();
        setMonsters(data);
        setStatusMessage(`Loaded ${data.length} monsters.`);
      } catch (error) {
        setStatusMessage(`Error: ${error instanceof Error ? error.message : "Failed to load monsters."}`);
      } finally {
        setIsLoading(false);
      }
    }

    loadMonsters();
  }, []);

  const filteredMonsters = useMemo(() => {
    let items = [...monsters];

    if (searchTerm.trim()) {
      const q = searchTerm.trim().toLowerCase();
      items = items.filter((m) => m.name.toLowerCase().includes(q));
    }

    if (selectedCrFilter) {
      const cr = Number(selectedCrFilter);
      items = items.filter((m) => m.challengeRating === cr);
    }

    items.sort((a, b) => {
      switch (selectedSort) {
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "cr-asc":
          return a.challengeRating - b.challengeRating || a.name.localeCompare(b.name);
        case "cr-desc":
          return b.challengeRating - a.challengeRating || a.name.localeCompare(b.name);
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return items;
  }, [monsters, searchTerm, selectedCrFilter, selectedSort]);

  const canCalculate = selectedMonsters.length > 0 && partySize > 0 && partyLevel >= 1 && partyLevel <= 20;
  const totalMonsterCount = selectedMonsters.reduce((sum, m) => sum + m.quantity, 0);
  const totalRawXp = selectedMonsters.reduce((sum, m) => sum + m.xp * m.quantity, 0);
  const highestCr = selectedMonsters.length ? Math.max(...selectedMonsters.map((m) => m.challengeRating)) : 0;

  async function runCalculation(nextSelectedMonsters = selectedMonsters, nextPartySize = partySize, nextPartyLevel = partyLevel) {
    const isValid = nextSelectedMonsters.length > 0 && nextPartySize > 0 && nextPartyLevel >= 1 && nextPartyLevel <= 20;
    if (!isValid) {
      setCalculationResult(null);
      return;
    }

    try {
      setIsCalculating(true);
      setStatusMessage("Calculating encounter...");

      const request = {
        partyMembers: Array.from({ length: nextPartySize }, () => ({ level: nextPartyLevel })),
        monsters: nextSelectedMonsters.map((m) => ({ monsterId: m.monsterId, quantity: m.quantity })),
      };

      const result = await calculateEncounter(request);
      setCalculationResult(result);
      setStatusMessage(`Encounter calculated: ${result?.difficulty ?? "Unknown"}`);
    } catch (error) {
      setStatusMessage(`Calculation failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsCalculating(false);
    }
  }

  function updateSelectedMonsters(updateFn) {
    setSelectedMonsters((prev) => {
      const next = updateFn(prev);
      void runCalculation(next, partySize, partyLevel);
      return next;
    });
  }

  function addMonster(monster) {
    updateSelectedMonsters((prev) => {
      const existing = prev.find((m) => m.monsterId === monster.id);
      if (existing) {
        return prev.map((m) => (m.monsterId === monster.id ? { ...m, quantity: m.quantity + 1 } : m));
      }

      return [
        ...prev,
        {
          monsterId: monster.id,
          name: monster.name,
          challengeRating: monster.challengeRating,
          xp: monster.xp,
          quantity: 1,
        },
      ];
    });
  }

  function increaseQuantity(monsterId) {
    updateSelectedMonsters((prev) => prev.map((m) => (m.monsterId === monsterId ? { ...m, quantity: m.quantity + 1 } : m)));
  }

  function decreaseQuantity(monsterId) {
    updateSelectedMonsters((prev) =>
      prev
        .map((m) => (m.monsterId === monsterId ? { ...m, quantity: m.quantity - 1 } : m))
        .filter((m) => m.quantity > 0)
    );
  }

  function removeMonster(monsterId) {
    updateSelectedMonsters((prev) => prev.filter((m) => m.monsterId !== monsterId));
  }

  function clearEncounter() {
    setSelectedMonsters([]);
    setCalculationResult(null);
    setStatusMessage("Encounter cleared.");
  }

  async function onPartySizeChanged(event) {
    const value = Number(event.target.value);
    setPartySize(value);
    await runCalculation(selectedMonsters, value, partyLevel);
  }

  async function onPartyLevelChanged(event) {
    const value = Number(event.target.value);
    setPartyLevel(value);
    await runCalculation(selectedMonsters, partySize, value);
  }

  function resetFilters() {
    setSearchTerm("");
    setSelectedSort("name-asc");
    setSelectedCrFilter("");
  }

  async function openMonsterDetails(monsterId) {
    try {
      setIsMonsterDetailsOpen(true);
      setIsLoadingMonsterDetails(true);
      setIsMonsterImageLoaded(false);
      setSelectedMonsterDetails(null);

      const data = await getMonsterDetails(monsterId);
      setSelectedMonsterDetails(data);
    } catch (error) {
      setStatusMessage(`Failed to load monster details: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsLoadingMonsterDetails(false);
    }
  }

  function closeMonsterDetails() {
    setIsMonsterDetailsOpen(false);
    setSelectedMonsterDetails(null);
    setIsMonsterImageLoaded(false);
  }

  return (
    <div className="encounter-page">
      <h3>Encounter Builder</h3>
      <p className="encounter-subtitle">Build balanced battles and keep the danger under control.</p>

      <div className="page-layout">
        <div className="left-panel">
          <div className="panel-card">
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
          </div>
        </div>

        <div className="right-panel">
          <div className="summary-strip">
            <div className="summary-box"><span>Total Monsters</span><strong>{totalMonsterCount}</strong></div>
            <div className="summary-box"><span>Unique</span><strong>{selectedMonsters.length}</strong></div>
            <div className="summary-box"><span>Raw XP</span><strong>{totalRawXp}</strong></div>
            <div className="summary-box"><span>Highest CR</span><strong>{formatCr(highestCr)}</strong></div>
            <div className={`summary-box ${calculationResult ? "highlight-box" : "summary-box-muted"}`}><span>Adjusted XP</span><strong>{calculationResult?.adjustedMonsterXp ?? 0}</strong></div>
            <div className={`summary-box ${calculationResult ? "" : "summary-box-muted"}`}><span>Multiplier</span><strong>{calculationResult?.monsterMultiplier ?? 0}</strong></div>
          </div>

          <div className="panel-card encounter-board">
            <div className="encounter-board-header">
              <h2>Encounter</h2>
              {calculationResult && <span className={`difficulty-badge ${getDifficultyClass(calculationResult.difficulty)}`}>{calculationResult.difficulty}</span>}
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
          </div>

          <div className="panel-card result-card">
            <div className="result-top">
              <h2>Result</h2>
              <button type="button" onClick={() => runCalculation()} disabled={!canCalculate || isCalculating}>
                {isCalculating ? "Calculating..." : "Calculate"}
              </button>
            </div>

            {!calculationResult ? (
              <p className="muted-text">No calculation yet.</p>
            ) : (
              <div className="result-grid">
                <div className="result-stat"><span className="result-stat-label">Easy Threshold</span><span className="result-stat-value">{calculationResult.partyEasyThreshold}</span></div>
                <div className="result-stat"><span className="result-stat-label">Medium Threshold</span><span className="result-stat-value">{calculationResult.partyMediumThreshold}</span></div>
                <div className="result-stat"><span className="result-stat-label">Hard Threshold</span><span className="result-stat-value">{calculationResult.partyHardThreshold}</span></div>
                <div className="result-stat"><span className="result-stat-label">Deadly Threshold</span><span className="result-stat-value">{calculationResult.partyDeadlyThreshold}</span></div>
              </div>
            )}

            <div className="status-line">Status: {statusMessage}</div>
          </div>
        </div>
      </div>

      {isMonsterDetailsOpen && (
        <div className="monster-modal-backdrop" onClick={closeMonsterDetails}>
          <div className="monster-modal" onClick={(e) => e.stopPropagation()}>
            <div className="monster-modal-header">
              <h2>Monster Details</h2>
              <button type="button" onClick={closeMonsterDetails}>Close</button>
            </div>

            {isLoadingMonsterDetails ? (
              <p>Loading monster details...</p>
            ) : !selectedMonsterDetails ? (
              <p>No monster details found.</p>
            ) : (
              <>
                <div className="monster-detail-top">
                  {!!selectedMonsterDetails.imageUrl && (
                    <div className="monster-image-frame">
                      <div className={`monster-image-placeholder ${isMonsterImageLoaded ? "hidden" : ""}`}>
                        <div className="monster-image-spinner" />
                      </div>

                      <img
                        src={selectedMonsterDetails.imageUrl}
                        alt={selectedMonsterDetails.name}
                        className={`monster-detail-image ${isMonsterImageLoaded ? "loaded" : ""}`}
                        onLoad={() => setIsMonsterImageLoaded(true)}
                      />
                    </div>
                  )}

                  <div>
                    <h3>{selectedMonsterDetails.name}</h3>
                    <p className="muted-text">{selectedMonsterDetails.size} {selectedMonsterDetails.type}, {selectedMonsterDetails.alignment}</p>
                    <p><strong>CR:</strong> {formatCr(selectedMonsterDetails.challengeRating)}</p>
                    <p><strong>XP:</strong> {selectedMonsterDetails.xp}</p>
                    <p><strong>AC:</strong> {selectedMonsterDetails.armorClass}</p>
                    <p><strong>HP:</strong> {selectedMonsterDetails.hitPoints} ({selectedMonsterDetails.hitDice})</p>
                    <p><strong>Speed:</strong> {selectedMonsterDetails.speed}</p>
                    <p><strong>Languages:</strong> {selectedMonsterDetails.languages}</p>
                  </div>
                </div>

                <div className="monster-statblock-abilities">
                  {[["STR", "strength"], ["DEX", "dexterity"], ["CON", "constitution"], ["INT", "intelligence"], ["WIS", "wisdom"], ["CHA", "charisma"]].map(([label, key]) => (
                    <div className="monster-statblock-ability" key={key}>
                      <div className="monster-statblock-label">{label}</div>
                      <div className="monster-statblock-score">{selectedMonsterDetails[key]} ({formatModifier(selectedMonsterDetails[key])})</div>
                    </div>
                  ))}
                </div>

                {selectedMonsterDetails.damageVulnerabilities?.length > 0 && <p><strong>Vulnerabilities:</strong> {selectedMonsterDetails.damageVulnerabilities.join(", ")}</p>}
                {selectedMonsterDetails.damageResistances?.length > 0 && <p><strong>Resistances:</strong> {selectedMonsterDetails.damageResistances.join(", ")}</p>}
                {selectedMonsterDetails.damageImmunities?.length > 0 && <p><strong>Immunities:</strong> {selectedMonsterDetails.damageImmunities.join(", ")}</p>}

                {selectedMonsterDetails.specialAbilities?.length > 0 && (
                  <div className="monster-section">
                    <h4>Special Abilities</h4>
                    {selectedMonsterDetails.specialAbilities.map((feature, idx) => <p key={idx}><strong>{feature.name}.</strong> {feature.description}</p>)}
                  </div>
                )}

                {selectedMonsterDetails.actions?.length > 0 && (
                  <div className="monster-section">
                    <h4>Actions</h4>
                    {selectedMonsterDetails.actions.map((feature, idx) => <p key={idx}><strong>{feature.name}.</strong> {feature.description}</p>)}
                  </div>
                )}

                {selectedMonsterDetails.reactions?.length > 0 && (
                  <div className="monster-section">
                    <h4>Reactions</h4>
                    {selectedMonsterDetails.reactions.map((feature, idx) => <p key={idx}><strong>{feature.name}.</strong> {feature.description}</p>)}
                  </div>
                )}

                {selectedMonsterDetails.legendaryActions?.length > 0 && (
                  <div className="monster-section">
                    <h4>Legendary Actions</h4>
                    {selectedMonsterDetails.legendaryActions.map((feature, idx) => <p key={idx}><strong>{feature.name}.</strong> {feature.description}</p>)}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
