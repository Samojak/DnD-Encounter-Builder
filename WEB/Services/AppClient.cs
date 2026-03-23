using System.Net.Http.Json;
using Shared;

namespace WEB.Services;

public class ApiClient
{
    private readonly HttpClient _http;

    public ApiClient(HttpClient http)
    {
        _http = http;
    }

    public async Task<List<MonsterListItemDto>> GetMonstersAsync()
    {
        return await _http.GetFromJsonAsync<List<MonsterListItemDto>>("api/monsters")
               ?? new List<MonsterListItemDto>();
    }

    public async Task<EncounterCalculationResponseDto?> CalculateAsync(EncounterCalculationRequestDto request)
    {
        var response = await _http.PostAsJsonAsync("api/encounters/calculate", request);
        response.EnsureSuccessStatusCode();

        return await response.Content.ReadFromJsonAsync<EncounterCalculationResponseDto>();
    }
    
    public async Task<MonsterDetailsDto?> GetMonsterDetailsAsync(int id)
    {
        return await _http.GetFromJsonAsync<MonsterDetailsDto>($"api/monsters/{id}/details");
    }
}