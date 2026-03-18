namespace API.Entities;

public class EncounterMonster
{
    public int Id { get; set; }

    public int EncounterId { get; set; }
    public Encounter Encounter { get; set; } = null!;

    public int MonsterId { get; set; }
    public Monster Monster { get; set; } = null!;

    public int Quantity { get; set; }
}