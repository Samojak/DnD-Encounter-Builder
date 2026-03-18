namespace Shared;

public class MonsterListItemDto
{
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public decimal ChallengeRating { get; set; }
        public int Xp { get; set; }
        public string Type { get; set; } = null!;
}
