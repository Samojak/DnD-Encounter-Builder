using API.Services;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/dev")]
public class DevController : ControllerBase
{
    private readonly MonsterImportService _monsterImportService;

    public DevController(MonsterImportService monsterImportService)
    {
        _monsterImportService = monsterImportService;
    }

    [HttpPost("import-monsters")]
    public async Task<IActionResult> ImportMonsters([FromQuery] int limit = 50)
    {
        var imported = await _monsterImportService.ImportMonstersAsync(limit);
        return Ok(new { imported });
    }
}