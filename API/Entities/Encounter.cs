namespace API.Entities;

public class Encounter
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public DateTime CreatedAt { get; set; }

    public ICollection<EncounterMonster> EncounterMonsters { get; set; } = new List<EncounterMonster>();

}