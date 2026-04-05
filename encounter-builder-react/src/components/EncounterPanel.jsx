export default function EncounterPanel({
                                           selectedMonsters,
                                           openMonsterDetails,
                                           increaseQuantity,
                                           decreaseQuantity,
                                           removeMonster,
                                       }) {
    return (
        <>
            <div className="panel-header">
                <h2>Encounter</h2>
            </div>

            {selectedMonsters.length === 0 ? (
                <div className="empty-state">
                    <p className="muted-text">No monsters added yet.</p>
                </div>
            ) : (
                <div className="encounter-list">
                    {selectedMonsters.map((monster) => (
                        <div className="encounter-row" key={monster.monsterId}>
                            <div>
                                <strong
                                    onClick={() => openMonsterDetails(monster.monsterId)}
                                    className="monster-name-link"
                                >
                                    {monster.name}
                                </strong>
                                <div className="muted-text">
                                    Qty: {monster.quantity} | XP each: {monster.xp}
                                </div>
                                <div className="muted-text">
                                    Subtotal XP: {monster.quantity * monster.xp}
                                </div>
                            </div>

                            <div className="encounter-actions">
                                <button onClick={() => decreaseQuantity(monster.monsterId)}>-</button>
                                <span className="qty-pill">{monster.quantity}</span>
                                <button onClick={() => increaseQuantity(monster.monsterId)}>+</button>
                                <button onClick={() => removeMonster(monster.monsterId)}>Remove</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}