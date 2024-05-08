using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Tiefseetauchner.OnlineMediaShelf.Domain;

namespace Tiefseetauchner.OnlineMediaShelf.Web.Controllers;

[ApiController]
[Route("shelves")]
public class ShelvesController(ApplicationContext context) : ControllerBase
{
  [HttpGet]
  public async Task<ActionResult<IEnumerable<Shelf>>> GetAllShelves([FromQuery] string? userName)
  {
    var shelves = await context.Shelves.AsQueryable().ToListAsync();

    return Ok(shelves);
  }
}