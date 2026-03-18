namespace API.Entities;

public class Monster
{
    public int Id { get; set; }
    public string ApiIndex { get; set; } = null!;
    public string Name { get; set; } = null!;
    public string Size { get; set; } = null!;
    public string Type { get; set; } = null!;
    public string Alignment { get; set; } = null!;
    public decimal ChallengeRating { get; set; }
    public int Xp { get; set; }
    public int HitPoints { get; set; }
    public string HitDice { get; set; } = null!;
    public int ArmorClass { get; set; }
    public string? ImageUrl { get; set; }
    public string ApiUrl { get; set; } = null!;
    public DateTime UpdatedAt { get; set; }
    public string RawJson { get; set; } = null!;

    public ICollection<EncounterMonster> EncounterMonsters { get; set; } = new List<EncounterMonster>();
    
}