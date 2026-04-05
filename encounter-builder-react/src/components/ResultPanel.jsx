export default function ResultPanel({
                                        selectedMonsters,
                                        handleCalculate,
                                        isCalculating,
                                        calculationResult,
                                    }) {
    return (
        <div>
            <div className="result-top">
                <h2>Result</h2>
                <button onClick={handleCalculate} disabled={selectedMonsters.length === 0}>
                    {isCalculating ? "Calculating..." : "Calculate"}
                </button>
            </div>

            {!calculationResult ? (
                <p className="muted-text">No calculation yet.</p>
            ) : (
                <div className="result-grid">
                    <div className="result-stat">
                        <span>Difficulty</span>
                        <strong>{calculationResult.difficulty}</strong>
                    </div>

                    <div className="result-stat">
                        <span>Easy</span>
                        <strong>{calculationResult.partyEasyThreshold}</strong>
                    </div>

                    <div className="result-stat">
                        <span>Medium</span>
                        <strong>{calculationResult.partyMediumThreshold}</strong>
                    </div>

                    <div className="result-stat">
                        <span>Hard</span>
                        <strong>{calculationResult.partyHardThreshold}</strong>
                    </div>

                    <div className="result-stat">
                        <span>Deadly</span>
                        <strong>{calculationResult.partyDeadlyThreshold}</strong>
                    </div>

                    <div className="result-stat">
                        <span>Adjusted XP</span>
                        <strong>{calculationResult.adjustedMonsterXp}</strong>
                    </div>
                </div>
            )}
        </div>
    );
}