namespace Shared;

public class EncounterCalculationRequestDto
{
    public List<PartyMemberDto> PartyMembers { get; set; } = [];
    public List<EncounterMonsterSelectionDto> Monsters { get; set; } = [];
}