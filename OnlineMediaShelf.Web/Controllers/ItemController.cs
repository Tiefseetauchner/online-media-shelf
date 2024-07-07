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

  [HttpGet("most-recent")]
  public async Task<ActionResult<List<ItemModel>>> GetMostRecentItems([FromQuery] int limit)
  {
    var items = await unitOfWork.ItemRepository.GetQueryable()
      .OrderByDescending(_ => _.Id)
      .Take(limit)
      .ToListAsync();

    return Ok(items);
  }

  [HttpGet("{id:int}")]
  public async Task<ActionResult<ItemModel>> GetItem(int id)
  {
    var item = await unitOfWork.ItemRepository.GetByIdAsync(id);
    if (item == null)
      return NotFound();

    return Ok(Mapper.ConvertToWebObject(item));
  }

  [HttpGet("{id:int}/cover-image")]
  public async Task<ActionResult> GetItemCoverImage(int id)
  {
    var fileContents = (await unitOfWork.ItemRepository.GetByIdAsync(id))?.CoverImage;

    return fileContents == null || fileContents.Length == 0 ? NotFound() : File(fileContents, "image/jpg");
  }

  [HttpPost("create")]
  [Authorize]
  [ProducesResponseType<ItemModel>(201)]
  public async Task<ActionResult<ItemModel>> CreateItem([FromBody] CreateItemModel item)
  {
    try
    {
      var mappedItem = Mapper.ConvertToDomainObject(item);

      var itemInDb = await unitOfWork.ItemRepository.CreateAsync(mappedItem);

      await unitOfWork.CommitAsync();

      return CreatedAtAction(nameof(GetItem), new { id = itemInDb.Id }, Mapper.ConvertToWebObject(itemInDb));
    }
    catch (Exception)
    {
      return StatusCode(500, "An error occured while saving changes. Try again later.");
    }
  }

  [HttpPost("update")]
  [Authorize]
  [ProducesResponseType<ItemModel>(201)]
  public async Task<ActionResult<ItemModel>> UpdateItem([FromBody] UpdateItemModel item)
  {
    var itemRepository = unitOfWork.ItemRepository;

    var oldDbItem = await itemRepository.GetByIdAsync(item.Id);
    if (oldDbItem == null)
      return NotFound();

    try
    {
      var mappedItem = Mapper.ConvertToDomainObject(item, oldDbItem);

      var itemInDb = await itemRepository.CreateAsync(mappedItem);

      await unitOfWork.CommitAsync();

      return CreatedAtAction(nameof(GetItem), new { id = itemInDb.Id }, Mapper.ConvertToWebObject(itemInDb));
    }
    catch (Exception)
    {
      return StatusCode(500, "An error occured while saving changes. Try again later.");
    }
  }

  [HttpPost("update/{id:int}/cover-image")]
  [Authorize]
  [ProducesResponseType<ItemModel>(201)]
  public async Task<ActionResult<ItemModel>> UpdateItemCoverImage(int id, [FromBody] byte[] fileContent)
  {
    try
    {
      var item = await unitOfWork.ItemRepository.GetByIdAsync(id);
      if (item == null)
        return NotFound();

      item.CoverImage = fileContent;

      await unitOfWork.CommitAsync();

      return Ok();
    }
    catch (Exception)
    {
      return StatusCode(500, "An error occured while saving changes. Try again later.");
    }
  }
}