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

    public async Task<int> ImportMonstersAsync(int limit = 50)
    {
        var indexes = await _dndApiClient.GetMonsterIndexesAsync();
        var importedCount = 0;

        foreach (var index in indexes.Take(limit))
        {
            var exists = await _dbContext.Monsters.AnyAsync(m => m.ApiIndex == index);
            if (exists)
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