using API.Data;
using API.Mappers;
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

    [HttpGet("{id:int}/details")]
    public async Task<ActionResult<MonsterDetailsDto>> GetDetails(int id)
    {
        var monster = await _db.Monsters.FindAsync(id);

        if (monster is null)
            return NotFound();

        var dto = MonsterMapper.ToDetailsDto(monster);

        return Ok(dto);
    }
}