using API.Data;
using Shared;
using Microsoft.EntityFrameworkCore;

namespace API.Services;

public class EncounterCalculationService
{
    private readonly AppDbContext _db;

    public EncounterCalculationService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<EncounterCalculationResponseDto> CalculateAsync(EncounterCalculationRequestDto request)
    {
        if (request.PartyMembers.Count == 0)
            throw new ArgumentException("Party must contain at least one member.");

        if (request.Monsters.Count == 0)
        {
            return new EncounterCalculationResponseDto
            {
                PartyEasyThreshold = request.PartyMembers.Sum(p => EncounterThresholds.GetForLevel(p.Level).Easy),
                PartyMediumThreshold = request.PartyMembers.Sum(p => EncounterThresholds.GetForLevel(p.Level).Medium),
                PartyHardThreshold = request.PartyMembers.Sum(p => EncounterThresholds.GetForLevel(p.Level).Hard),
                PartyDeadlyThreshold = request.PartyMembers.Sum(p => EncounterThresholds.GetForLevel(p.Level).Deadly),
                RawMonsterXp = 0,
                MonsterMultiplier = 1,
                AdjustedMonsterXp = 0,
                MonsterCount = 0,
                Difficulty = DifficultyRating.Trivial
            };
        }

        var monsterIds = request.Monsters.Select(m => m.MonsterId).ToList();

        var monstersFromDb = await _db.Monsters
            .Where(m => monsterIds.Contains(m.Id))
            .ToDictionaryAsync(m => m.Id);

        var rawXp = 0;
        var monsterCount = 0;

        foreach (var selectedMonster in request.Monsters)
        {
            if (!monstersFromDb.TryGetValue(selectedMonster.MonsterId, out var monster))
                continue;

            rawXp += monster.Xp * selectedMonster.Quantity;
            monsterCount += selectedMonster.Quantity;
        }

        var easy = request.PartyMembers.Sum(p => EncounterThresholds.GetForLevel(p.Level).Easy);
        var medium = request.PartyMembers.Sum(p => EncounterThresholds.GetForLevel(p.Level).Medium);
        var hard = request.PartyMembers.Sum(p => EncounterThresholds.GetForLevel(p.Level).Hard);
        var deadly = request.PartyMembers.Sum(p => EncounterThresholds.GetForLevel(p.Level).Deadly);

        var multiplier = GetMonsterMultiplier(monsterCount, request.PartyMembers.Count);
        var adjustedXp = (int)Math.Round(rawXp * multiplier);

        var difficulty = DifficultyRating.Trivial;

        if (adjustedXp >= deadly)
            difficulty = DifficultyRating.Deadly;
        else if (adjustedXp >= hard)
            difficulty = DifficultyRating.Hard;
        else if (adjustedXp >= medium)
            difficulty = DifficultyRating.Medium;
        else if (adjustedXp >= easy)
            difficulty = DifficultyRating.Easy;

        return new EncounterCalculationResponseDto
        {
            PartyEasyThreshold = easy,
            PartyMediumThreshold = medium,
            PartyHardThreshold = hard,
            PartyDeadlyThreshold = deadly,
            RawMonsterXp = rawXp,
            MonsterMultiplier = multiplier,
            AdjustedMonsterXp = adjustedXp,
            MonsterCount = monsterCount,
            Difficulty = difficulty
        };
    }

    private static double GetMonsterMultiplier(int monsterCount, int partySize)
    {
        double baseMultiplier = monsterCount switch
        {
            0 => 1,
            1 => 1,
            2 => 1.5,
            >= 3 and <= 6 => 2,
            >= 7 and <= 10 => 2.5,
            >= 11 and <= 14 => 3,
            _ => 4
        };

        if (partySize < 3)
            baseMultiplier = IncreaseMultiplier(baseMultiplier);
        else if (partySize > 5)
            baseMultiplier = DecreaseMultiplier(baseMultiplier);

        return baseMultiplier;
    }

    private static double IncreaseMultiplier(double current) =>
        current switch
        {
            1 => 1.5,
            1.5 => 2,
            2 => 2.5,
            2.5 => 3,
            3 => 4,
            _ => 4
        };

    private static double DecreaseMultiplier(double current) =>
        current switch
        {
            4 => 3,
            3 => 2.5,
            2.5 => 2,
            2 => 1.5,
            1.5 => 1,
            _ => 1
        };
}