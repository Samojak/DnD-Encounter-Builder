const BASE_URL = "http://localhost:5199/api"; // api url!

export async function getMonsters() {
    const response = await fetch(`${BASE_URL}/monsters`);

    if (!response.ok) {
        throw new Error("Failed to fetch monsters");
    }

    return response.json();
}

export async function calculateEncounter(request) {
    const response = await fetch(`${BASE_URL}/encounters/calculate`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        throw new Error("Failed to calculate encounter");
    }

    return response.json();
}

export async function getMonsterDetails(monsterId) {
    const response = await fetch(`${BASE_URL}/monsters/${monsterId}/details`);

    if (!response.ok) {
        throw new Error("Failed to fetch monster details");
    }

    return response.json();
}