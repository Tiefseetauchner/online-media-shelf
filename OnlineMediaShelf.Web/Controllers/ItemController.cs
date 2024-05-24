#region

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Tiefseetauchner.OnlineMediaShelf.Domain;
using Tiefseetauchner.OnlineMediaShelf.Web.WebObjects;

#endregion

namespace Tiefseetauchner.OnlineMediaShelf.Web.Controllers;

[ApiController]
[Route("api/items")]
public class ItemController(
  IUnitOfWork unitOfWork) : ControllerBase
{
  [HttpGet]
  // TODO (Tiefseetauchner): Implement pagination
  public async Task<ActionResult<List<ItemModel>>> GetAllItems()
  {
    var items = await unitOfWork.ItemRepository.GetAllAsync();
    var itemModels = items.Select(Mapper.ConvertToWebObject);

    return Ok(itemModels);
  }

  [HttpGet("search")]
  public async Task<ActionResult<List<ItemModel>>> SearchItem([FromQuery] string? title,
    [FromQuery]
    string? barcode,
    [FromQuery]
    int limit,
    [FromQuery]
    List<int> excludedItems)
  {
    // TODO (Tiefseetauchner): Fuzzy Search?
    var items = await unitOfWork.ItemRepository.GetQueryable()
      .Where(i => title == null || i.Title.Contains(title))
      .Where(i => barcode == null || i.Barcode == null || i.Barcode.Contains(barcode))
      .Where(i => !excludedItems.Contains(i.Id))
      .Take(limit)
      .ToListAsync();

    return Ok(items);
  }

  [HttpGet("{id:int}")]
  public async Task<ActionResult<ItemModel>> GetItem(int id)
  {
    return Ok(await unitOfWork.ItemRepository.GetByIdAsync(id));
  }

  [HttpPost("create")]
  [Authorize]
  [ProducesResponseType<ItemModel>(201)]
  public async Task<ActionResult<ItemModel>> CreateItem([FromBody] CreateItemModel shelf)
  {
    try
    {
      var mappedItem = Mapper.ConvertToDomainObject(shelf);

      var itemInDb = await unitOfWork.ItemRepository.CreateAsync(mappedItem);

      await unitOfWork.CommitAsync();

      return CreatedAtAction(nameof(GetItem), new { id = itemInDb.Id }, Mapper.ConvertToWebObject(itemInDb));
    }
    catch (Exception)
    {
      return StatusCode(500, "An error occured while saving changes. Try again later.");
    }
  }
}