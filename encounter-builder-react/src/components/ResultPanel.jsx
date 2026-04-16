export default function ResultPanel({ calculationResult, canCalculate, isCalculating, runCalculation, statusMessage }) {
  return (
    <>
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
    </>
  );
}
