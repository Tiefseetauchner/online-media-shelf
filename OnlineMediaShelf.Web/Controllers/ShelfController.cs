using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Tiefseetauchner.OnlineMediaShelf.Domain;
using Item = Tiefseetauchner.OnlineMediaShelf.Web.WebObjects.Item;
using Shelf = Tiefseetauchner.OnlineMediaShelf.Web.WebObjects.Shelf;

namespace Tiefseetauchner.OnlineMediaShelf.Web.Controllers;

[ApiController]
[Route("shelves")]
public class ShelfController(ApplicationContext context) : ControllerBase
{
  [HttpGet]
  public async Task<ActionResult<IEnumerable<Shelf>>> GetAllShelves([FromQuery] string? userName)
  {
    var shelvesFromDb = await context.Shelves
      .AsQueryable()
      .Where(_ => _.ApplicationUser.NormalizedUserName == userName)
      .ToListAsync();

    var shelves = shelvesFromDb.Select(ConvertToWebObject);

    return Ok(shelves);
  }

  [HttpGet("{id}")]
  public async Task<ActionResult<IEnumerable<Shelf>>> GetShelf(int id)
  {
    var shelfFromDb = await context.Shelves
      .FindAsync(id);

    if (shelfFromDb != null)
      return Ok(ConvertToWebObject(shelfFromDb));

    return NotFound();
  }

  [HttpPost("create")]
  [Authorize]
  public async Task<ActionResult<Shelf>> CreateShelf([FromBody] Shelf shelf)
  {
    var shelfInDb = context.Shelves.Add(ConvertToDomainObject(shelf));

    try
    {
      await context.SaveChangesAsync();
    }
    catch (Exception)
    {
      return StatusCode(500, "An error occured while saving changes. Try again later.");
    }

    return CreatedAtAction(nameof(GetShelf), new { id = shelfInDb.Entity.ShelfId }, ConvertToWebObject(shelfInDb.Entity));
  }

  private static Shelf ConvertToWebObject(Domain.Shelf shelf) =>
    new(shelf.ShelfId, shelf.UserId, shelf.Items.Select(ConvertToWebObject).ToList());

  private static Item ConvertToWebObject(Domain.Item item) =>
    new(item.ItemId, item.Barcode, item.Title);

  private static Domain.Shelf ConvertToDomainObject(Shelf shelf) =>
    new() { UserId = shelf.UserId, Items = shelf.Items.Select(ConvertToDomainObject).ToList() };

  private static Domain.Item ConvertToDomainObject(Item item) =>
    new() { Barcode = item.Barcode, Title = item.Title };
}