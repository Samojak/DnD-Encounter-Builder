using API.Clients;
using API.Data;
using API.Mappers;
using Microsoft.EntityFrameworkCore;

namespace API.Services;

public class MonsterImportService
{
    private readonly DndApiClient _dndApiClient;
    private readonly AppDbContext _dbContext;

    public MonsterImportService(DndApiClient dndApiClient, AppDbContext dbContext)
    {
        _dndApiClient = dndApiClient;
        _dbContext = dbContext;
    }

    public async Task<int> ImportMonstersAsync(int? limit = null)
    {
        var indexes = await _dndApiClient.GetMonsterIndexesAsync();

        if (limit.HasValue)
        {
            indexes = indexes.Take(limit.Value).ToList();
        }

        var existingIndexes = await _dbContext.Monsters
            .Select(m => m.ApiIndex)
            .ToHashSetAsync();

        var importedCount = 0;

        foreach (var index in indexes)
        {
            if (existingIndexes.Contains(index))
                continue;

            var rawJson = await _dndApiClient.GetMonsterRawJsonAsync(index);
            var dto = await _dndApiClient.GetMonsterAsync(index);

            if (dto == null)
                continue;

            var monster = MonsterMapper.ToEntity(dto, rawJson);

            _dbContext.Monsters.Add(monster);
            importedCount++;
        }

        await _dbContext.SaveChangesAsync();
        return importedCount;
    }
}