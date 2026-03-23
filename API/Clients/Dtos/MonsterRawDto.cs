using System.Text.Json.Serialization;

namespace API.Clients.Dtos;

public class MonsterRawDto
{
    [JsonPropertyName("image")]
    public string? Image { get; set; }

    [JsonPropertyName("strength")]
    public int Strength { get; set; }

    [JsonPropertyName("dexterity")]
    public int Dexterity { get; set; }

    [JsonPropertyName("constitution")]
    public int Constitution { get; set; }

    [JsonPropertyName("intelligence")]
    public int Intelligence { get; set; }

    [JsonPropertyName("wisdom")]
    public int Wisdom { get; set; }

    [JsonPropertyName("charisma")]
    public int Charisma { get; set; }

    [JsonPropertyName("speed")]
    public Dictionary<string, string>? Speed { get; set; }

    [JsonPropertyName("languages")]
    public string? Languages { get; set; }

    [JsonPropertyName("damage_vulnerabilities")]
    public List<string>? DamageVulnerabilities { get; set; }

    [JsonPropertyName("damage_resistances")]
    public List<string>? DamageResistances { get; set; }

    [JsonPropertyName("damage_immunities")]
    public List<string>? DamageImmunities { get; set; }

    [JsonPropertyName("special_abilities")]
    public List<RawMonsterFeatureDto>? SpecialAbilities { get; set; }

    [JsonPropertyName("actions")]
    public List<RawMonsterFeatureDto>? Actions { get; set; }

    [JsonPropertyName("reactions")]
    public List<RawMonsterFeatureDto>? Reactions { get; set; }

    [JsonPropertyName("legendary_actions")]
    public List<RawMonsterFeatureDto>? LegendaryActions { get; set; }
}