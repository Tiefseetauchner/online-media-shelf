#region

using System.Linq;
using Tiefseetauchner.OnlineMediaShelf.Domain.Models;

#endregion

namespace Tiefseetauchner.OnlineMediaShelf.Web.WebObjects;

public static class Mapper
{
  public static ShelfModel ConvertToWebObject(Shelf shelf) =>
    new(shelf.Id, ConvertToWebObject(shelf.User), shelf.ShelfName, shelf.ShelfDescription, shelf.Items.Select(ConvertToWebObject).ToList());

  private static UserModel ConvertToWebObject(ApplicationUser user) =>
    new(user.Id, user.UserName ?? "", user.SignUpDate);

  public static ItemModel ConvertToWebObject(Item item) =>
    new(item.Id, item.Data.Barcode, item.Data.Title, item.Data.Description, item.Data.Authors, item.Data.ReleaseDate, item.Data.Format);

  public static Shelf ConvertToDomainObject(CreateShelfModel shelf) =>
    new() { ShelfName = shelf.Name, ShelfDescription = shelf.Description };

  public static Item ConvertToDomainObject(CreateItemModel item)
  {
    var itemData = new ItemData
    {
      Barcode = item.Barcode,
      Title = item.Title,
      Version = 0,
      Description = item.Description,
      ReleaseDate = item.ReleaseDate,
      Format = item.Format,
      Authors = item.Authors
    };

    return new Item
    {
      Data = itemData
    };
  }

  public static Item ConvertToDomainObject(UpdateItemModel item, Item oldDbItem)
  {
    var itemData = new ItemData
    {
      Version = oldDbItem.Data.Version + 1,
      Barcode = item.Barcode,
      Title = item.Title,
      Description = item.Description,
      Authors = item.Authors,
      ReleaseDate = item.ReleaseDate ?? default,
      Format = item.Format
    };

    var domainItem = new Item
    {
      Id = item.Id,
      Data = itemData
    };

    return domainItem;
  }

  public static Shelf ConvertToDomainObject(ShelfModel shelf) =>
    new()
    {
      User = ConvertToDomainObject(shelf.User),
      ShelfName = shelf.Name,
      ShelfDescription = shelf.Description,
      Items = shelf.Items.Select(ConvertToDomainObject).ToList()
    };

  private static ApplicationUser ConvertToDomainObject(UserModel user) =>
    new()
    {
      Id = user.UserId,
    };

  private static Item ConvertToDomainObject(ItemModel itemModel) =>
    new()
    {
      Id = itemModel.Id,
      Data =
      {
        Barcode = itemModel.Barcode,
        Title = itemModel.Title,
        ReleaseDate = itemModel.ReleaseDate,
        Format = itemModel.Format,
        Authors = itemModel.Authors,
      }
    };
}