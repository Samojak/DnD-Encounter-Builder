export default function MonsterList({
                                        monsters,
                                        isLoading,
                                        error,
                                        searchTerm,
                                        setSearchTerm,
                                        selectedSort,
                                        setSelectedSort,
                                        selectedCrFilter,
                                        setSelectedCrFilter,
                                        addMonster,
                                        openMonsterDetails,
                                    }) {
    const filteredMonsters = monsters
        .filter((monster) =>
            monster.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .filter((monster) => {
            if (selectedCrFilter === "") return true;
            return monster.challengeRating === Number(selectedCrFilter);
        })
        .sort((a, b) => {
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

    function formatCr(cr) {
        if (cr === 0.125) return "1/8";
        if (cr === 0.25) return "1/4";
        if (cr === 0.5) return "1/2";
        return Number.isInteger(cr) ? String(cr) : cr;
    }

    return (
        <div>
            <h2>Monsters</h2>

            <div className="toolbar">
                <input
                    type="text"
                    placeholder="Search monsters..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                <select
                    value={selectedSort}
                    onChange={(e) => setSelectedSort(e.target.value)}
                >
                    <option value="name-asc">Name A-Z</option>
                    <option value="name-desc">Name Z-A</option>
                    <option value="cr-asc">CR Low to High</option>
                    <option value="cr-desc">CR High to Low</option>
                </select>

                <select
                    value={selectedCrFilter}
                    onChange={(e) => setSelectedCrFilter(e.target.value)}
                >
                    <option value="">All CR</option>
                    <option value="0">0</option>
                    <option value="0.125">1/8</option>
                    <option value="0.25">1/4</option>
                    <option value="0.5">1/2</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                </select>
            </div>

            <p className="muted-text monster-count-line">
                Showing {filteredMonsters.length} of {monsters.length} monsters
            </p>

            {isLoading && <p>Loading monsters...</p>}
            {error && <p>Error: {error}</p>}

            <div className="monster-list">
                {filteredMonsters.map((monster) => (
                    <div className="monster-row" key={monster.id}>
                        <div>
                            <strong
                                onClick={() => openMonsterDetails(monster.id)}
                                className="monster-name-link"
                            >
                                {monster.name}
                            </strong>
                            <div className="muted-text">
                                CR {formatCr(monster.challengeRating)}, XP {monster.xp}, {monster.type}
                            </div>
                        </div>

                        <button onClick={() => addMonster(monster)}>Add</button>
                    </div>
                ))}
            </div>
        </div>
    );
}