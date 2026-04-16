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

export default function MonsterModal({
  isOpen,
  isLoading,
  monster,
  isMonsterImageLoaded,
  closeMonsterDetails,
  onMonsterImageLoaded,
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="monster-modal-backdrop" onClick={closeMonsterDetails}>
      <div className="monster-modal" onClick={(e) => e.stopPropagation()}>
        <div className="monster-modal-header">
          <h2>Monster Details</h2>
          <button type="button" onClick={closeMonsterDetails}>Close</button>
        </div>

        {isLoading ? (
          <p>Loading monster details...</p>
        ) : !monster ? (
          <p>No monster details found.</p>
        ) : (
          <>
            <div className="monster-detail-top">
              {!!monster.imageUrl && (
                <div className="monster-image-frame">
                  <div className={`monster-image-placeholder ${isMonsterImageLoaded ? "hidden" : ""}`}>
                    <div className="monster-image-spinner" />
                  </div>

                  <img
                    src={monster.imageUrl}
                    alt={monster.name}
                    className={`monster-detail-image ${isMonsterImageLoaded ? "loaded" : ""}`}
                    onLoad={onMonsterImageLoaded}
                  />
                </div>
              )}

              <div>
                <h3>{monster.name}</h3>
                <p className="muted-text">{monster.size} {monster.type}, {monster.alignment}</p>
                <p><strong>CR:</strong> {formatCr(monster.challengeRating)}</p>
                <p><strong>XP:</strong> {monster.xp}</p>
                <p><strong>AC:</strong> {monster.armorClass}</p>
                <p><strong>HP:</strong> {monster.hitPoints} ({monster.hitDice})</p>
                <p><strong>Speed:</strong> {monster.speed}</p>
                <p><strong>Languages:</strong> {monster.languages}</p>
              </div>
            </div>

            <div className="monster-statblock-abilities">
              {[["STR", "strength"], ["DEX", "dexterity"], ["CON", "constitution"], ["INT", "intelligence"], ["WIS", "wisdom"], ["CHA", "charisma"]].map(([label, key]) => (
                <div className="monster-statblock-ability" key={key}>
                  <div className="monster-statblock-label">{label}</div>
                  <div className="monster-statblock-score">{monster[key]} ({formatModifier(monster[key])})</div>
                </div>
              ))}
            </div>

            {monster.damageVulnerabilities?.length > 0 && <p><strong>Vulnerabilities:</strong> {monster.damageVulnerabilities.join(", ")}</p>}
            {monster.damageResistances?.length > 0 && <p><strong>Resistances:</strong> {monster.damageResistances.join(", ")}</p>}
            {monster.damageImmunities?.length > 0 && <p><strong>Immunities:</strong> {monster.damageImmunities.join(", ")}</p>}

            {monster.specialAbilities?.length > 0 && (
              <div className="monster-section">
                <h4>Special Abilities</h4>
                {monster.specialAbilities.map((feature, idx) => <p key={idx}><strong>{feature.name}.</strong> {feature.description}</p>)}
              </div>
            )}

            {monster.actions?.length > 0 && (
              <div className="monster-section">
                <h4>Actions</h4>
                {monster.actions.map((feature, idx) => <p key={idx}><strong>{feature.name}.</strong> {feature.description}</p>)}
              </div>
            )}

            {monster.reactions?.length > 0 && (
              <div className="monster-section">
                <h4>Reactions</h4>
                {monster.reactions.map((feature, idx) => <p key={idx}><strong>{feature.name}.</strong> {feature.description}</p>)}
              </div>
            )}

            {monster.legendaryActions?.length > 0 && (
              <div className="monster-section">
                <h4>Legendary Actions</h4>
                {monster.legendaryActions.map((feature, idx) => <p key={idx}><strong>{feature.name}.</strong> {feature.description}</p>)}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
