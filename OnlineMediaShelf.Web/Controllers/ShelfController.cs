#region

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
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
  IUnitOfWork unitOfWork,
  UserManager<ApplicationUser> userManager) : ControllerBase
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

  [HttpGet("search")]
  public async Task<ActionResult<List<ShelfModel>>> SearchShelves([FromQuery] string? userName, [FromQuery] int? limit, [FromQuery] List<int>? filteredItemsId, [FromQuery] string? shelfName)
  {
    IQueryable<Shelf> shelvesFromDbQueryable = unitOfWork.ShelfRepository
      .AsQueryable()
      .OrderByDescending(_ => _.ShelfName);

    if (!string.IsNullOrEmpty(shelfName))
      shelvesFromDbQueryable = shelvesFromDbQueryable.Where(_ => _.ShelfName.Contains(shelfName));

    if (!string.IsNullOrEmpty(userName))
      shelvesFromDbQueryable = shelvesFromDbQueryable.Where(shelf => shelf.User.UserName!.Contains(userName));

    if (filteredItemsId != null)
      shelvesFromDbQueryable = shelvesFromDbQueryable.Where(shelf => !shelf.Items.Any(item => filteredItemsId.Contains(item.Id)));

    if (limit != null)
      shelvesFromDbQueryable = shelvesFromDbQueryable.Take(limit.Value);

    var shelvesFromDb = await shelvesFromDbQueryable.ToListAsync();

    return Ok(shelvesFromDb.Select(Mapper.ConvertToWebObject));
  }

  [HttpGet("search-paged")]
  public async Task<ActionResult<List<ShelfModel>>> SearchShelvesPaged([FromQuery] string? userName, [FromQuery] string? shelfName, [FromQuery] int? page, [FromQuery] int? pageSize)
  {
    IQueryable<Shelf> shelvesFromDbQueryable = unitOfWork.ShelfRepository
      .AsQueryable()
      .OrderByDescending(_ => _.ShelfName);

    if (!string.IsNullOrEmpty(shelfName))
      shelvesFromDbQueryable = shelvesFromDbQueryable.Where(_ => _.ShelfName.Contains(shelfName));

    if (!string.IsNullOrEmpty(userName))
      shelvesFromDbQueryable = shelvesFromDbQueryable.Where(shelf => shelf.User.UserName!.Contains(userName));

    if (page != null && pageSize is > 0)
      shelvesFromDbQueryable = shelvesFromDbQueryable.Skip(page.Value * pageSize.Value).Take(pageSize.Value);

    var shelvesFromDb = await shelvesFromDbQueryable.ToListAsync();

    return Ok(shelvesFromDb.Select(Mapper.ConvertToWebObject));
  }

  [HttpGet("count")]
  public async Task<ActionResult<int>> GetShelfCount() =>
    Ok(await unitOfWork.ShelfRepository.AsQueryable().CountAsync());

  [HttpGet("{id:int}")]
  public async Task<ActionResult<ShelfModel>> GetShelf(int id)
  {
    var shelfFromDb = await unitOfWork.ShelfRepository.GetByIdAsync(id);

    if (shelfFromDb == null)
      return NotFound();

    return Ok(Mapper.ConvertToWebObject(shelfFromDb));
  }

  [HttpDelete("{id:int}")]
  public async Task<ActionResult<ShelfModel>> DeleteShelf(int id)
  {
    var shelfFromDb = await unitOfWork.ShelfRepository.GetByIdAsync(id);

    if (shelfFromDb == null)
      return NotFound();

    var user = await userManager.GetUserAsync(User);
    if (shelfFromDb.User.Id != user?.Id)
      return Forbid();

    unitOfWork.ShelfRepository.Delete(shelfFromDb);

    await unitOfWork.CommitAsync();

    return Ok();
  }

  [HttpPost("create")]
  [Authorize]
  [ProducesResponseType<ShelfModel>(201)]
  public async Task<ActionResult<ShelfModel>> CreateShelf([FromBody] CreateShelfModel shelf)
  {
    try
    {
      var mappedShelf = Mapper.ConvertToDomainObject(shelf);
      mappedShelf.User = await userManager.GetUserAsync(User) ?? throw new Exception("User not found.");

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

    var user = await userManager.GetUserAsync(User);

    if (user?.Id != shelf.User.Id)
      return Unauthorized("User not allowed to add item to shelf");

    shelf.Items.Add(await unitOfWork.ItemRepository.AsQueryable().SingleAsync(i => i.Id == item.Id));

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

    var user = await userManager.GetUserAsync(User);

    if (user?.Id != shelf.User.Id)
      return Unauthorized("User not allowed to remove item to shelf");

    var item = shelf.Items.FirstOrDefault(i => i.Id == itemId);
    if (item == null)
      return NotFound();

    shelf.Items.Remove(item);

    await unitOfWork.CommitAsync();

    return Ok();
  }

  [HttpPost("{id:int}/edit")]
  [Authorize]
  [ProducesResponseType(200)]
  public async Task<IActionResult> EditShelf(int id, [FromBody] EditShelfModel shelf)
  {
    try
    {
      var shelfInDb = await unitOfWork.ShelfRepository.GetByIdAsync(id);

      if (shelfInDb == null)
        return NotFound();

      var user = await userManager.GetUserAsync(User);
      if (user?.Id != shelfInDb.User.Id)
        return Forbid();

      shelfInDb.ShelfName = shelf.Name;
      shelfInDb.ShelfDescription = shelf.Description;

      await unitOfWork.CommitAsync();

      return Ok();
    }
    catch (Exception)
    {
      return StatusCode(500, "An error occured while saving changes. Try again later.");
    }
  }
}