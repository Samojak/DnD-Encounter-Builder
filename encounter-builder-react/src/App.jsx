import { useEffect, useState } from "react";
import { 
    getMonsters,
    calculateEncounter,
    getMonsterDetails 
} from "./api/monsterApi";


import MonsterList from "./components/MonsterList";
import EncounterPanel from "./components/EncounterPanel";
import ResultPanel from "./components/ResultPanel";
import MonsterModal from "./components/MonsterModal";





function App() {
    const [partySize, setPartySize] = useState(4);
    const [partyLevel, setPartyLevel] = useState(1);
    
    const [monsters, setMonsters] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedSort, setSelectedSort] = useState("name-asc");
    const [selectedCrFilter, setSelectedCrFilter] = useState("");
    
    const [selectedMonsters, setSelectedMonsters] = useState([]);
    
    const [calculationResult, setCalculationResult] = useState(null);
    const [isCalculating, setIsCalculating] = useState(false);
    
    const [selectedMonsterDetails, setSelectedMonsterDetails] = useState(null);
    const [isMonsterDetailsOpen, setIsMonsterDetailsOpen] = useState(false);
    const [isLoadingMonsterDetails, setIsLoadingMonsterDetails] = useState(false);

    function handlePartySizeChange(e) {
        setPartySize(Number(e.target.value));
    }

    function handlePartyLevelChange(e) {
        setPartyLevel(Number(e.target.value));
    }
    

    useEffect(() => {
        async function loadMonsters() {
            try {
                setIsLoading(true);
                setError(null);

                const data = await getMonsters();
                console.log(data);
                setMonsters(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        }

        loadMonsters();
    }, []);

    
    function addMonster(monster) {
        setSelectedMonsters((prevSelectedMonsters) => {
            const existingMonster = prevSelectedMonsters.find(
                (m) => m.monsterId === monster.id
            );

            if (existingMonster) {
                return prevSelectedMonsters.map((m) =>
                    m.monsterId === monster.id
                        ? { ...m, quantity: m.quantity + 1 }
                        : m
                );
            }

            const newSelectedMonster = {
                monsterId: monster.id,
                name: monster.name,
                challengeRating: monster.challengeRating,
                xp: monster.xp,
                quantity: 1,
            };

            return [...prevSelectedMonsters, newSelectedMonster];
        });
    }

    function increaseQuantity(monsterId) {
        setSelectedMonsters((prev) =>
            prev.map((m) =>
                m.monsterId === monsterId
                    ? { ...m, quantity: m.quantity + 1 }
                    : m
            )
        );
    }

    function decreaseQuantity(monsterId) {
        setSelectedMonsters((prev) =>
            prev
                .map((m) =>
                    m.monsterId === monsterId
                        ? { ...m, quantity: m.quantity - 1 }
                        : m
                )
                .filter((m) => m.quantity > 0)
        );
    }

    function removeMonster(monsterId) {
        setSelectedMonsters((prev) =>
            prev.filter((m) => m.monsterId !== monsterId)
        );
    }

    async function handleCalculate() {
        try {
            setIsCalculating(true);

            const request = {
                partyMembers: Array.from({ length: partySize }, () => ({
                    level: partyLevel, 
                })),
                monsters: selectedMonsters.map((m) => ({
                    monsterId: m.monsterId,
                    quantity: m.quantity,
                })),
            };

            const result = await calculateEncounter(request);
            setCalculationResult(result);

        } catch (err) {
            console.error(err);
        } finally {
            setIsCalculating(false);
        }
    }


    async function openMonsterDetails(monsterId) {
        try {
            setIsMonsterDetailsOpen(true);
            setIsLoadingMonsterDetails(true);
            setSelectedMonsterDetails(null);

            const data = await getMonsterDetails(monsterId);
            setSelectedMonsterDetails(data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoadingMonsterDetails(false);
        }
    }

    function closeMonsterDetails() {
        setIsMonsterDetailsOpen(false);
        setSelectedMonsterDetails(null);
    }

    function formatCr(cr) {
        if (cr === 0.125) return "1/8";
        if (cr === 0.25) return "1/4";
        if (cr === 0.5) return "1/2";
        return Number.isInteger(cr) ? String(cr) : cr;
    }

    function formatModifier(score) {
        const modifier = Math.floor((score - 10) / 2);
        return modifier >= 0 ? `+${modifier}` : `${modifier}`;
    }

    const totalMonsterCount = selectedMonsters.reduce((sum, m) => sum + m.quantity, 0);
    const totalRawXp = selectedMonsters.reduce((sum, m) => sum + m.xp * m.quantity, 0);
    const highestCr = selectedMonsters.length > 0
        ? Math.max(...selectedMonsters.map((m) => m.challengeRating))
        : 0;



    return (
        <div className="encounter-page">
            <div className="app-shell">
                <h1 className="page-title">Encounter Builder</h1>
                <p className="page-subtitle">
                    Build balanced battles and keep the danger under control.
                </p>

                <div className="top-controls">
                    <div className="control-group">
                        <label>Party Size</label>
                        <input
                            type="number"
                            min="1"
                            value={partySize}
                            onChange={handlePartySizeChange}
                        />
                    </div>

                    <div className="control-group">
                        <label>Party Level</label>
                        <input
                            type="number"
                            min="1"
                            max="20"
                            value={partyLevel}
                            onChange={handlePartyLevelChange}
                        />
                    </div>
                </div>

                <div className="main-grid">
                    <div className="left-column">
                        <div className="panel-card monster-panel-card">
                            <MonsterList
                                monsters={monsters}
                                isLoading={isLoading}
                                error={error}
                                searchTerm={searchTerm}
                                setSearchTerm={setSearchTerm}
                                selectedSort={selectedSort}
                                setSelectedSort={setSelectedSort}
                                selectedCrFilter={selectedCrFilter}
                                setSelectedCrFilter={setSelectedCrFilter}
                                addMonster={addMonster}
                                openMonsterDetails={openMonsterDetails}
                            />
                        </div>
                    </div>

                    <div className="right-column">
                        <div className="summary-strip">
                            <div className="summary-box">
                                <span>Total Monsters</span>
                                <strong>{totalMonsterCount}</strong>
                            </div>

                            <div className="summary-box">
                                <span>Unique</span>
                                <strong>{selectedMonsters.length}</strong>
                            </div>

                            <div className="summary-box">
                                <span>Raw XP</span>
                                <strong>{totalRawXp}</strong>
                            </div>

                            <div className="summary-box">
                                <span>Highest CR</span>
                                <strong>{formatCr(highestCr)}</strong>
                            </div>

                            <div className="summary-box">
                                <span>Adjusted XP</span>
                                <strong>{calculationResult?.adjustedMonsterXp ?? 0}</strong>
                            </div>

                            <div className="summary-box">
                                <span>Multiplier</span>
                                <strong>{calculationResult?.monsterMultiplier ?? 0}</strong>
                            </div>
                        </div>

                        <div className="panel-card encounter-card">
                            <EncounterPanel
                                selectedMonsters={selectedMonsters}
                                openMonsterDetails={openMonsterDetails}
                                increaseQuantity={increaseQuantity}
                                decreaseQuantity={decreaseQuantity}
                                removeMonster={removeMonster}
                            />
                        </div>

                        <div className="panel-card result-card">
                            <ResultPanel
                                selectedMonsters={selectedMonsters}
                                handleCalculate={handleCalculate}
                                isCalculating={isCalculating}
                                calculationResult={calculationResult}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <MonsterModal
                isOpen={isMonsterDetailsOpen}
                onClose={closeMonsterDetails}
                isLoading={isLoadingMonsterDetails}
                monster={selectedMonsterDetails}
                formatCr={formatCr}
                formatModifier={formatModifier}
            />
        </div>
    );
}

export default App;