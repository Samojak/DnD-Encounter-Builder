using API.Clients.Dtos;
using API.Entities;

namespace API.Mappers;

public class MonsterMapper
{
    public static Monster ToEntity(MonsterApiDto dto, string rawJson)
    {
        return new Monster
        {
            ApiIndex = dto.Index,
            Name = dto.Name,
            Size = dto.Size,
            Type = dto.Type,
            Alignment = dto.Alignment,
            ArmorClass = dto.ArmorClass.FirstOrDefault()?.Value ?? 0,
            HitPoints = dto.HitPoints,
            HitDice = dto.HitDice,
            ChallengeRating = dto.ChallengeRating,
            Xp = dto.Xp,
            ImageUrl = string.IsNullOrWhiteSpace(dto.Image) ? null : $"https://www.dnd5eapi.co{dto.Image}",
            ApiUrl = dto.Url,
            UpdatedAt = dto.UpdatedAt,
            RawJson = rawJson
        };
    }
}