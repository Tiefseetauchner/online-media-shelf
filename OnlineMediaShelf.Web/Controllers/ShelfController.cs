using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Tiefseetauchner.OnlineMediaShelf.Domain;
using Tiefseetauchner.OnlineMediaShelf.Web.WebObjects;
using Shelf = Tiefseetauchner.OnlineMediaShelf.Web.WebObjects.Shelf;

namespace Tiefseetauchner.OnlineMediaShelf.Web.Controllers;

[ApiController]
[Route("api/shelves")]
public class ShelfController(ApplicationContext context) : ControllerBase
{
  [HttpGet]
  public async Task<ActionResult<IEnumerable<Shelf>>> GetAllShelves([FromQuery] string? userName)
  {
    var shelvesFromDb = await context.Shelves
      .AsQueryable()
      .Where(_ => userName.IsNullOrEmpty() || _.ApplicationUser.NormalizedUserName == userName)
      .ToListAsync();

    var shelves = shelvesFromDb.Select(Mapper.ConvertToWebObject);

    return Ok(shelves);
  }

  [HttpGet("{id:int}")]
  public async Task<ActionResult<IEnumerable<Shelf>>> GetShelf(int id)
  {
    var shelfFromDb = await context.Shelves
      .FindAsync(id);

    if (shelfFromDb != null)
      return Ok(Mapper.ConvertToWebObject(shelfFromDb));

    return NotFound();
  }

  [HttpPost("create")]
  [Authorize]
  public async Task<ActionResult<Shelf>> CreateShelf([FromBody] CreateShelfModel shelf)
  {
    var shelfInDb = context.Shelves.Add(Mapper.ConvertToDomainObject(shelf));

    try
    {
      await context.SaveChangesAsync();
    }
    catch (Exception)
    {
      return StatusCode(500, "An error occured while saving changes. Try again later.");
    }

    return CreatedAtAction(nameof(GetShelf), new { id = shelfInDb.Entity.ShelfId }, Mapper.ConvertToWebObject(shelfInDb.Entity));
  }
}