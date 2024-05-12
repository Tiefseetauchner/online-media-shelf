#region

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Tiefseetauchner.OnlineMediaShelf.Web.WebObjects;
using Shelf = Tiefseetauchner.OnlineMediaShelf.Web.WebObjects.Shelf;

#endregion

namespace Tiefseetauchner.OnlineMediaShelf.Web.Controllers;

[ApiController]
[Route("api/shelves")]
public class ShelfController(DbSet<Domain.Shelf> shelfDataSet) : ControllerBase
{
  [HttpGet]
  public ActionResult<IEnumerable<Shelf>> GetAllShelves([FromQuery] string? userName)
  {
    var shelvesFromDb = shelfDataSet.AsQueryable()
      .Where(shelf => userName.IsNullOrEmpty() || shelf.ApplicationUser.NormalizedUserName == userName)
      .ToList();

    var shelves = shelvesFromDb.Select(Mapper.ConvertToWebObject);

    return Ok(shelves);
  }

  [HttpGet("{id:int}")]
  public async Task<ActionResult<Shelf>> GetShelf(int id)
  {
    var shelfFromDb = await shelfDataSet.FindAsync(id);

    if (shelfFromDb != null)
      return Ok(Mapper.ConvertToWebObject(shelfFromDb));

    return NotFound();
  }

  [HttpPost("create")]
  [Authorize]
  [ProducesResponseType<Shelf>(201)]
  public async Task<ActionResult<Shelf>> CreateShelf([FromBody] CreateShelfModel shelf)
  {
    var shelfInDb = shelfDataSet.Add(Mapper.ConvertToDomainObject(shelf));

    try
    {
      // await shelfDataSet.SaveChangesAsync();
    }
    catch (Exception)
    {
      return StatusCode(500, "An error occured while saving changes. Try again later.");
    }

    return CreatedAtAction(nameof(GetShelf), new { id = shelfInDb.Entity.ShelfId }, Mapper.ConvertToWebObject(shelfInDb.Entity));
  }
}