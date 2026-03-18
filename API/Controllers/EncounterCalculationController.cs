using API.Services;
using Shared;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/encounters")]
public class EncounterCalculationController : ControllerBase
{
    private readonly EncounterCalculationService _calculationService;

    public EncounterCalculationController(EncounterCalculationService calculationService)
    {
        _calculationService = calculationService;
    }

    [HttpPost("calculate")]
    public async Task<ActionResult<EncounterCalculationResponseDto>> Calculate(
        [FromBody] EncounterCalculationRequestDto request)
    {
        var result = await _calculationService.CalculateAsync(request);
        return Ok(result);
    }
}