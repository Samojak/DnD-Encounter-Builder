using System.Text.Json.Serialization;

namespace API.Clients.Dtos;

public class RawMonsterFeatureDto
{
    [JsonPropertyName("name")]
    public string Name { get; set; } = null!;

    [JsonPropertyName("desc")]
    public string Desc { get; set; } = null!;
}