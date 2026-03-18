using System.Text.Json.Serialization;

namespace API.Clients.Dtos;

public class MonsterApiDto
{
    [JsonPropertyName("index")]
    public string Index { get; set; } = null!;

    [JsonPropertyName("name")]
    public string Name { get; set; } = null!;

    [JsonPropertyName("size")]
    public string Size { get; set; } = null!;

    [JsonPropertyName("type")]
    public string Type { get; set; } = null!;

    [JsonPropertyName("alignment")]
    public string Alignment { get; set; } = null!;

    [JsonPropertyName("armor_class")]
    public List<ArmorClassDto> ArmorClass { get; set; } = [];

    [JsonPropertyName("hit_points")]
    public int HitPoints { get; set; }

    [JsonPropertyName("hit_dice")]
    public string HitDice { get; set; } = null!;

    [JsonPropertyName("challenge_rating")]
    public decimal ChallengeRating { get; set; }

    [JsonPropertyName("xp")]
    public int Xp { get; set; }

    [JsonPropertyName("image")]
    public string? Image { get; set; }

    [JsonPropertyName("url")]
    public string Url { get; set; } = null!;

    [JsonPropertyName("updated_at")]
    public DateTime UpdatedAt { get; set; }
}

public class ArmorClassDto
{
    [JsonPropertyName("type")]
    public string Type { get; set; } = null!;

    [JsonPropertyName("value")]
    public int Value { get; set; }
}