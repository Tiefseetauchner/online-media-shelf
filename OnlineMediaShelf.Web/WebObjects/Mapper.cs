using System.Linq;

namespace Tiefseetauchner.OnlineMediaShelf.Web.WebObjects;

public static class Mapper
{
  public static Domain.Shelf ConvertToDomainObject(CreateShelfModel shelf) =>
    new() { UserId = shelf.UserId, ShelfName = shelf.Name, ShelfDescription = shelf.Description };

  public static Shelf ConvertToWebObject(Domain.Shelf shelf) =>
    new(shelf.ShelfId, shelf.UserId, shelf.Items?.Select(ConvertToWebObject).ToList());

  public static Item ConvertToWebObject(Domain.Item item) =>
    new(item.ItemId, item.Barcode, item.Title);

  public static Domain.Shelf ConvertToDomainObject(Shelf shelf) =>
    new() { UserId = shelf.UserId, Items = shelf.Items.Select(ConvertToDomainObject).ToList() };

  public static Domain.Item ConvertToDomainObject(Item item) =>
    new() { Barcode = item.Barcode, Title = item.Title };
}