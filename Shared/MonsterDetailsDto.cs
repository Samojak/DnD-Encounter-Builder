namespace Shared;

public class MonsterDetailsDto
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public string Size { get; set; } = null!;
    public string Type { get; set; } = null!;
    public string Alignment { get; set; } = null!;
    public decimal ChallengeRating { get; set; }
    public int Xp { get; set; }

    public int ArmorClass { get; set; }
    public int HitPoints { get; set; }
    public string HitDice { get; set; } = null!;
    public string? ImageUrl { get; set; }

    public string? Speed { get; set; }
    public string? Senses { get; set; }
    public string? Languages { get; set; }

    public int Strength { get; set; }
    public int Dexterity { get; set; }
    public int Constitution { get; set; }
    public int Intelligence { get; set; }
    public int Wisdom { get; set; }
    public int Charisma { get; set; }

    public List<string> DamageVulnerabilities { get; set; } = new();
    public List<string> DamageResistances { get; set; } = new();
    public List<string> DamageImmunities { get; set; } = new();
    public List<string> ConditionImmunities { get; set; } = new();

    public List<MonsterFeatureDto> SpecialAbilities { get; set; } = new();
    public List<MonsterFeatureDto> Actions { get; set; } = new();
    public List<MonsterFeatureDto> Reactions { get; set; } = new();
    public List<MonsterFeatureDto> LegendaryActions { get; set; } = new();
}