using API.Data;
using Shared;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace API.Controllers;

[ApiController]
[Route("api/monsters")]
public class MonstersController : ControllerBase
{
    private readonly AppDbContext _db;

    public MonstersController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<List<MonsterListItemDto>>> GetAll()
    {
        var monsters = await _db.Monsters
            .OrderBy(m => m.ChallengeRating)
            .Select(m => new MonsterListItemDto
            {
                Id = m.Id,
                Name = m.Name,
                ChallengeRating = m.ChallengeRating,
                Xp = m.Xp,
                Type = m.Type
            })
            .ToListAsync();

        return Ok(monsters);
    }
}