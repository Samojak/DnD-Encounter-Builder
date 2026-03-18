using System.Text.Json;
using API.Clients.Dtos;

namespace API.Clients;

public class DndApiClient
{
    private readonly HttpClient _httpClient;

    public DndApiClient(HttpClient httpClient)
    {
        _httpClient = httpClient;
        _httpClient.BaseAddress = new Uri("https://www.dnd5eapi.co/api/2014/");
    }

    public async Task<List<string>> GetMonsterIndexesAsync()
    {
        var response = await _httpClient.GetStringAsync("monsters");
        var json = JsonDocument.Parse(response);

        var results = json.RootElement.GetProperty("results");

        return results
            .EnumerateArray()
            .Select(x => x.GetProperty("index").GetString()!)
            .ToList();
    }

    public async Task<MonsterApiDto> GetMonsterAsync(string index)
    {
        var response = await _httpClient.GetStringAsync($"monsters/{index}");
        return JsonSerializer.Deserialize<MonsterApiDto>(response)!;
    }
    
    public async Task<string> GetMonsterRawJsonAsync(string index)
    {
        return await _httpClient.GetStringAsync($"monsters/{index}");
    }
    
}