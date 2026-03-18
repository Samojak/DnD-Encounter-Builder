namespace Shared;

public class EncounterCalculationResponseDto
{
    public int PartyEasyThreshold { get; set; }
    public int PartyMediumThreshold { get; set; }
    public int PartyHardThreshold { get; set; }
    public int PartyDeadlyThreshold { get; set; }

    public int RawMonsterXp { get; set; }
    public double MonsterMultiplier { get; set; }
    public int AdjustedMonsterXp { get; set; }

    public int MonsterCount { get; set; }

    public DifficultyRating Difficulty { get; set; }
}