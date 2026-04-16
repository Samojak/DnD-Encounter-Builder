import { useEffect, useMemo, useState } from "react";
import { calculateEncounter, getMonsterDetails, getMonsters } from "./api/monsterApi";
import MonsterList from "./components/MonsterList";
import EncounterPanel from "./components/EncounterPanel";
import ResultPanel from "./components/ResultPanel";
import MonsterModal from "./components/MonsterModal";

function formatCr(cr) {
  if (cr === 0.125) return "1/8";
  if (cr === 0.25) return "1/4";
  if (cr === 0.5) return "1/2";
  return Number.isInteger(cr) ? String(cr) : Number(cr).toFixed(2).replace(/\.00$/, "").replace(/0$/, "");
}

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

      return [...prev, { monsterId: monster.id, name: monster.name, challengeRating: monster.challengeRating, xp: monster.xp, quantity: 1 }];
    });
  }

  function increaseQuantity(monsterId) {
    updateSelectedMonsters((prev) => prev.map((m) => (m.monsterId === monsterId ? { ...m, quantity: m.quantity + 1 } : m)));
  }

  function decreaseQuantity(monsterId) {
    updateSelectedMonsters((prev) => prev.map((m) => (m.monsterId === monsterId ? { ...m, quantity: m.quantity - 1 } : m)).filter((m) => m.quantity > 0));
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
            <MonsterList
              partySize={partySize}
              partyLevel={partyLevel}
              onPartySizeChanged={onPartySizeChanged}
              onPartyLevelChanged={onPartyLevelChanged}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedSort={selectedSort}
              setSelectedSort={setSelectedSort}
              selectedCrFilter={selectedCrFilter}
              setSelectedCrFilter={setSelectedCrFilter}
              resetFilters={resetFilters}
              filteredMonsters={filteredMonsters}
              monsters={monsters}
              isLoading={isLoading}
              selectedMonsters={selectedMonsters}
              addMonster={addMonster}
              openMonsterDetails={openMonsterDetails}
            />
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
            <EncounterPanel
              selectedMonsters={selectedMonsters}
              calculationResult={calculationResult}
              openMonsterDetails={openMonsterDetails}
              decreaseQuantity={decreaseQuantity}
              increaseQuantity={increaseQuantity}
              removeMonster={removeMonster}
              clearEncounter={clearEncounter}
            />
          </div>

          <div className="panel-card result-card">
            <ResultPanel
              calculationResult={calculationResult}
              canCalculate={canCalculate}
              isCalculating={isCalculating}
              runCalculation={runCalculation}
              statusMessage={statusMessage}
            />
          </div>
        </div>
      </div>

      <MonsterModal
        isOpen={isMonsterDetailsOpen}
        isLoading={isLoadingMonsterDetails}
        monster={selectedMonsterDetails}
        isMonsterImageLoaded={isMonsterImageLoaded}
        closeMonsterDetails={closeMonsterDetails}
        onMonsterImageLoaded={() => setIsMonsterImageLoaded(true)}
      />
    </div>
  );
}
