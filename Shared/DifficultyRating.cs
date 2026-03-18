using System.Text.Json.Serialization;

namespace Shared;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum DifficultyRating
{
    Trivial,
    Easy,
    Medium,
    Hard,
    Deadly
}