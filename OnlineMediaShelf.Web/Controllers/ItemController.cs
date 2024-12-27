#region

using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NSwag.Annotations;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;
using Tiefseetauchner.OnlineMediaShelf.Domain;
using Tiefseetauchner.OnlineMediaShelf.Domain.Models;
using Tiefseetauchner.OnlineMediaShelf.Web.WebObjects;

#endregion

namespace Tiefseetauchner.OnlineMediaShelf.Web.Controllers;

[ApiController]
[Route("api/items")]
public class ItemController(
  IUnitOfWork unitOfWork,
  UserManager<ApplicationUser> userManager) : ControllerBase
{
  private const int c_imageMaxWidth = 600;
  private const int c_imageMaxHeight = 800;

  [HttpGet]
  public async Task<ActionResult<List<ItemModel>>> GetItems([FromQuery] int pageSize, [FromQuery] int page)
  {
    var items = pageSize <= 0 ? await unitOfWork.ItemRepository.GetAllAsync() : await unitOfWork.ItemRepository.GetPaged(page, pageSize);
    var itemModels = items.Select(Mapper.ConvertToWebObject);

    return Ok(itemModels);
  }

  [HttpGet("count")]
  public async Task<ActionResult<int>> GetItemCount([FromQuery] string? title) =>
    Ok(await unitOfWork.ItemRepository.AsQueryable().Where(i => title == null || i.Data.Title.Contains(title)).CountAsync());

  [HttpGet("search")]
  public async Task<ActionResult<List<ItemModel>>> SearchItem([FromQuery] string? title,
    [FromQuery]
    string? barcode,
    [FromQuery]
    int limit,
    [FromQuery]
    List<int> excludedItems)
  {
    if (limit == 0)
      limit = 10;

    var items = await unitOfWork.ItemRepository.AsQueryable()
      .Where(i => title == null || i.Data.Title.Contains(title))
      .Where(i => barcode == null || i.Data.Barcode.Contains(barcode))
      .Where(i => !excludedItems.AsQueryable().Contains(i.Id))
      .Take(limit)
      .Include(_ => _.Data)
      .OrderBy(_ => _.Data.Title)
      .ToListAsync();

    return Ok(items.Select(Mapper.ConvertToWebObject));
  }

  [HttpGet("search-paged")]
  public async Task<ActionResult<List<ItemModel>>> SearchItemPaged([FromQuery] string? title,
    [FromQuery]
    string? barcode,
    [FromQuery]
    List<int> excludedItems,
    [FromQuery]
    int pageSize,
    [FromQuery]
    int page)
  {
    var items = await unitOfWork.ItemRepository.AsQueryable()
      .Where(i => title == null || i.Data.Title.Contains(title))
      .Where(i => barcode == null || i.Data.Barcode.Contains(barcode))
      .Where(i => !excludedItems.AsQueryable().Contains(i.Id))
      .Skip(page * pageSize)
      .Take(pageSize)
      .Include(_ => _.Data)
      .OrderBy(_ => _.Data.Title)
      .ToListAsync();

    return Ok(items.Select(Mapper.ConvertToWebObject));
  }

  [HttpGet("{id:int}")]
  public async Task<ActionResult<ItemModel>> GetItem(int id)
  {
    var item = await unitOfWork.ItemRepository.GetByIdAsync(id);
    if (item == null)
      return NotFound("Item not found");

    return Ok(Mapper.ConvertToWebObject(item));
  }

  [HttpGet("{itemId:int}/cover-image")]
  public async Task<ActionResult> GetItemCoverImage(int itemId)
  {
    var fileContents = (await unitOfWork.ItemImageRepository.GetByItemId(itemId)).FirstOrDefault();

    return fileContents == null || fileContents.Data.Length == 0 ? NotFound("Cover image not found.") : File(fileContents.Data, "image/jpg");
  }

  [HttpPost("create")]
  [Authorize]
  [ProducesResponseType<ItemModel>(201)]
  public async Task<ActionResult<ItemModel>> CreateItem([FromBody] CreateItemModel item)
  {
    if (unitOfWork.ItemRepository.AsQueryable().Any(i => i.Data.Barcode == item.Barcode))
      return BadRequest("Item with this barcode already exists.");

    try
    {
      var mappedItem = Mapper.ConvertToDomainObject(item);

      var authors = GetOrCreateAuthors(item.Authors);
      mappedItem.Data.Authors = authors ?? [];

      var user = await userManager.GetUserAsync(User);

      if (user == null)
        return Unauthorized("User not found");

      mappedItem.Creator = user;
      mappedItem.Data.Editor = user;

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

      var authors = GetOrCreateAuthors(item.Authors) ?? oldDbItem.Data.Authors;
      mappedItem.Authors = authors;

      var user = await userManager.GetUserAsync(User);

      if (user == null)
        return Unauthorized("User not found");

      mappedItem.Editor = user;

      oldDbItem.Data = mappedItem;

      var itemInDb = itemRepository.Update(oldDbItem);

      await unitOfWork.CommitAsync();

      return CreatedAtAction(nameof(GetItem), new { id = item.Id }, Mapper.ConvertToWebObject(itemInDb));
    }
    catch (Exception)
    {
      return StatusCode(500, "An error occured while saving changes. Try again later.");
    }
  }

  private List<ItemAuthor>? GetOrCreateAuthors(List<Author>? authors) =>
    authors?
      .Select(author => unitOfWork.ItemAuthorRepository.GetByName(author.Name)
                        ?? unitOfWork.ItemAuthorRepository.Create(new ItemAuthor { Name = author.Name }))
      .ToList();

  [HttpPost("update/{id:int}/cover-image")]
  [Authorize]
  [ProducesResponseType<ItemModel>(201)]
  [OpenApiBodyParameter("application/octet-stream")]
  public async Task<ActionResult<ItemModel>> UpdateItemCoverImage(int id)
  {
    try
    {
      var item = await unitOfWork.ItemRepository.GetByIdAsync(id);
      if (item == null)
        return NotFound();

      using (var convertedImageStream = new MemoryStream())
      {
        var image = await Image.LoadAsync(Request.Body);

        image.Mutate(_ => _.Resize(new ResizeOptions { Size = new Size(c_imageMaxWidth, c_imageMaxHeight), Mode = ResizeMode.Max }));

        await image.SaveAsJpegAsync(convertedImageStream);

        // TODO (lena): Currently, we only have one image so we'll delete the old one.
        var oldImage = (await unitOfWork.ItemImageRepository.GetByItemId(id)).SingleOrDefault();

        if (oldImage != null)
          unitOfWork.ItemImageRepository.Delete(oldImage);

        await unitOfWork.ItemImageRepository.CreateAsync(new ItemImage
        {
          Data = convertedImageStream.ToArray(),
          OwningItem = item,
        });
      }

      await unitOfWork.CommitAsync();

      return Ok();
    }
    catch (Exception)
    {
      return StatusCode(500, "An error occured while updating an image. Try again later.");
    }
  }

  [HttpDelete("{id:int}/cover-image/{imageId:guid}")]
  public async Task<ActionResult> DeleteItemCoverImage(int id, Guid imageId)
  {
    try
    {
      var image = await unitOfWork.ItemImageRepository.AsQueryable().Where(_ => _.OwningItem.Id == id && _.Id == imageId).SingleOrDefaultAsync();

      if (image == null)
        return NotFound();

      unitOfWork.ItemImageRepository.Delete(image);

      await unitOfWork.CommitAsync();

      return Ok();
    }
    catch
    {
      return StatusCode(503, "An error occured while deleting an image.");
    }
  }
}