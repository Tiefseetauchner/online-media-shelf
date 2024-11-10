#region

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Tiefseetauchner.OnlineMediaShelf.Domain;
using Tiefseetauchner.OnlineMediaShelf.Domain.Models;
using Tiefseetauchner.OnlineMediaShelf.Web.WebObjects;

#endregion

namespace Tiefseetauchner.OnlineMediaShelf.Web.Controllers;

[ApiController]
[Route("api/shelves")]
public class ShelfController(
  IUnitOfWork unitOfWork) : ControllerBase
{
  [HttpGet]
  public async Task<ActionResult<IEnumerable<ShelfModel>>> GetAllShelves([FromQuery] string? userName, [FromQuery] int? page, [FromQuery] int? pageSize)
  {
    List<Shelf> shelvesFromDb;
    if (userName != null)
      shelvesFromDb = await unitOfWork.ShelfRepository.GetByUserAsync(await unitOfWork.UserRepository.GetByUserNameAsync(userName));
    else if (page == null || pageSize == null || pageSize <= 0)
      shelvesFromDb = await unitOfWork.ShelfRepository.GetAllAsync();
    else
      shelvesFromDb = await unitOfWork.ShelfRepository.GetPaged(page.Value, pageSize.Value);

    var shelves = shelvesFromDb.Select(Mapper.ConvertToWebObject);

    return Ok(shelves);
  }

  [HttpGet("{id:int}")]
  public async Task<ActionResult<ShelfModel>> GetShelf(int id)
  {
    var shelfFromDb = await unitOfWork.ShelfRepository.GetByIdAsync(id);

    if (shelfFromDb != null)
      return Ok(Mapper.ConvertToWebObject(shelfFromDb));

    return NotFound();
  }

  [HttpPost("create")]
  [Authorize]
  [ProducesResponseType<ShelfModel>(201)]
  public async Task<ActionResult<ShelfModel>> CreateShelf([FromBody] CreateShelfModel shelf)
  {
    try
    {
      var mappedShelf = Mapper.ConvertToDomainObject(shelf);
      mappedShelf.User = await unitOfWork.UserRepository.GetByIdAsync(shelf.UserId) ?? throw new ArgumentNullException(nameof(shelf.UserId), "User not found");

      var shelfInDb = await unitOfWork.ShelfRepository.CreateAsync(mappedShelf);

      await unitOfWork.CommitAsync();

      return CreatedAtAction(nameof(GetShelf), new { id = shelfInDb.Id }, Mapper.ConvertToWebObject(shelfInDb));
    }
    catch (Exception)
    {
      return StatusCode(500, "An error occured while saving changes. Try again later.");
    }
  }

  [HttpPost("{id:int}/items/add")]
  [Authorize]
  [ProducesResponseType(201)]
  public async Task<IActionResult> AddItem(int id, [FromBody] ItemAddModel item)
  {
    var shelf = await unitOfWork.ShelfRepository.GetByIdAsync(id);

    if (shelf == null)
      return NotFound();

    shelf.Items.Add(await unitOfWork.ItemRepository.GetQueryable().SingleAsync(i => i.Id == item.Id));

    await unitOfWork.CommitAsync();

    return Created();
  }

  [HttpPost("{id:int}/items/remove")]
  [Authorize]
  [ProducesResponseType(200)]
  public async Task<IActionResult> RemoveItem(int id, [FromQuery] int itemId)
  {
    var shelf = await unitOfWork.ShelfRepository.GetByIdAsync(id);

    if (shelf == null)
      return NotFound();

    var item = shelf.Items.FirstOrDefault(i => i.Id == itemId);
    if (item == null)
      return NotFound();

    shelf.Items.Remove(item);

    await unitOfWork.CommitAsync();

    return Ok();
  }
}