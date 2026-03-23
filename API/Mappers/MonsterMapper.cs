using API.Clients.Dtos;
using API.Entities;
using Shared;
using System.Text.Json;

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

    public static MonsterDetailsDto ToDetailsDto(Monster monster)
    {
        var raw = JsonSerializer.Deserialize<MonsterRawDto>(
            monster.RawJson,
            new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

        if (raw is null)
            throw new InvalidOperationException("Failed to parse RawJson");

        return new MonsterDetailsDto
        {
            Id = monster.Id,
            Name = monster.Name,
            Size = monster.Size,
            Type = monster.Type,
            Alignment = monster.Alignment,
            ChallengeRating = monster.ChallengeRating,
            Xp = monster.Xp,

            ArmorClass = monster.ArmorClass,
            HitPoints = monster.HitPoints,
            HitDice = monster.HitDice,
            ImageUrl = monster.ImageUrl ?? raw.Image,

            Strength = raw.Strength,
            Dexterity = raw.Dexterity,
            Constitution = raw.Constitution,
            Intelligence = raw.Intelligence,
            Wisdom = raw.Wisdom,
            Charisma = raw.Charisma,

            Speed = raw.Speed is null
                ? null
                : string.Join(", ", raw.Speed.Select(entry => $"{entry.Key}: {entry.Value}")),

            Languages = raw.Languages,

            DamageVulnerabilities = raw.DamageVulnerabilities ?? new List<string>(),
            DamageResistances = raw.DamageResistances ?? new List<string>(),
            DamageImmunities = raw.DamageImmunities ?? new List<string>(),

            SpecialAbilities = MapFeatures(raw.SpecialAbilities),
            Actions = MapFeatures(raw.Actions),
            Reactions = MapFeatures(raw.Reactions),
            LegendaryActions = MapFeatures(raw.LegendaryActions)
        };
    }

    private static List<MonsterFeatureDto> MapFeatures(List<RawMonsterFeatureDto>? features)
    {
        if (features is null)
            return new List<MonsterFeatureDto>();

        return features.Select(f => new MonsterFeatureDto
        {
            Name = f.Name,
            Description = f.Desc
        }).ToList();
    }
}