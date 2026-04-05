export default function MonsterModal({
                                         isOpen,
                                         onClose,
                                         isLoading,
                                         monster,
                                         formatCr,
                                         formatModifier,
                                     }) {
    if (!isOpen) return null;

    return (
        <div className="monster-modal-backdrop" onClick={onClose}>
            <div className="monster-modal" onClick={(e) => e.stopPropagation()}>
                <div className="monster-modal-header">
                    <h2>Monster Details</h2>
                    <button onClick={onClose}>Close</button>
                </div>

                {isLoading ? (
                    <p>Loading monster details...</p>
                ) : !monster ? (
                    <p>No monster details found.</p>
                ) : (
                    <>
                        <div className="monster-detail-top">
                            {monster.imageUrl && (
                                <div className="monster-image-frame">
                                    <img
                                        src={monster.imageUrl}
                                        alt={monster.name}
                                        className="monster-detail-image loaded"
                                    />
                                </div>
                            )}

                            <div>
                                <h3>{monster.name}</h3>

                                <p className="muted-text">
                                    {monster.size} {monster.type}, {monster.alignment}
                                </p>

                                <p><strong>CR:</strong> {formatCr(monster.challengeRating)}</p>
                                <p><strong>XP:</strong> {monster.xp}</p>
                                <p><strong>AC:</strong> {monster.armorClass}</p>
                                <p><strong>HP:</strong> {monster.hitPoints} ({monster.hitDice})</p>
                                <p><strong>Speed:</strong> {monster.speed}</p>
                                <p><strong>Languages:</strong> {monster.languages}</p>
                            </div>
                        </div>

                        <div className="monster-statblock-abilities">
                            <div className="monster-statblock-ability">
                                <div className="monster-statblock-label">STR</div>
                                <div className="monster-statblock-score">
                                    {monster.strength} ({formatModifier(monster.strength)})
                                </div>
                            </div>

                            <div className="monster-statblock-ability">
                                <div className="monster-statblock-label">DEX</div>
                                <div className="monster-statblock-score">
                                    {monster.dexterity} ({formatModifier(monster.dexterity)})
                                </div>
                            </div>

                            <div className="monster-statblock-ability">
                                <div className="monster-statblock-label">CON</div>
                                <div className="monster-statblock-score">
                                    {monster.constitution} ({formatModifier(monster.constitution)})
                                </div>
                            </div>

                            <div className="monster-statblock-ability">
                                <div className="monster-statblock-label">INT</div>
                                <div className="monster-statblock-score">
                                    {monster.intelligence} ({formatModifier(monster.intelligence)})
                                </div>
                            </div>

                            <div className="monster-statblock-ability">
                                <div className="monster-statblock-label">WIS</div>
                                <div className="monster-statblock-score">
                                    {monster.wisdom} ({formatModifier(monster.wisdom)})
                                </div>
                            </div>

                            <div className="monster-statblock-ability">
                                <div className="monster-statblock-label">CHA</div>
                                <div className="monster-statblock-score">
                                    {monster.charisma} ({formatModifier(monster.charisma)})
                                </div>
                            </div>
                        </div>

                        {monster.damageVulnerabilities?.length > 0 && (
                            <p>
                                <strong>Vulnerabilities:</strong> {monster.damageVulnerabilities.join(", ")}
                            </p>
                        )}

                        {monster.damageResistances?.length > 0 && (
                            <p>
                                <strong>Resistances:</strong> {monster.damageResistances.join(", ")}
                            </p>
                        )}

                        {monster.damageImmunities?.length > 0 && (
                            <p>
                                <strong>Immunities:</strong> {monster.damageImmunities.join(", ")}
                            </p>
                        )}

                        {monster.specialAbilities?.length > 0 && (
                            <div className="monster-section">
                                <h4>Special Abilities</h4>
                                {monster.specialAbilities.map((feature, index) => (
                                    <p key={index}>
                                        <strong>{feature.name}.</strong> {feature.description}
                                    </p>
                                ))}
                            </div>
                        )}

                        {monster.actions?.length > 0 && (
                            <div className="monster-section">
                                <h4>Actions</h4>
                                {monster.actions.map((feature, index) => (
                                    <p key={index}>
                                        <strong>{feature.name}.</strong> {feature.description}
                                    </p>
                                ))}
                            </div>
                        )}

                        {monster.reactions?.length > 0 && (
                            <div className="monster-section">
                                <h4>Reactions</h4>
                                {monster.reactions.map((feature, index) => (
                                    <p key={index}>
                                        <strong>{feature.name}.</strong> {feature.description}
                                    </p>
                                ))}
                            </div>
                        )}

                        {monster.legendaryActions?.length > 0 && (
                            <div className="monster-section">
                                <h4>Legendary Actions</h4>
                                {monster.legendaryActions.map((feature, index) => (
                                    <p key={index}>
                                        <strong>{feature.name}.</strong> {feature.description}
                                    </p>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}