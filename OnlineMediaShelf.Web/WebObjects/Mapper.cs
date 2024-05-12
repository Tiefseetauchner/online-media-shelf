#region

using System.Linq;
using Tiefseetauchner.OnlineMediaShelf.Domain.Models;

#endregion

namespace Tiefseetauchner.OnlineMediaShelf.Web.WebObjects;

public static class Mapper
{
  public static Shelf ConvertToDomainObject(CreateShelfModel shelf) =>
    new() { UserId = shelf.UserId, ShelfName = shelf.Name, ShelfDescription = shelf.Description };

  public static ShelfModel ConvertToWebObject(Shelf shelf) =>
    new(shelf.ShelfId, ConvertToWebObject(shelf.ApplicationUser), shelf.ShelfName, shelf.ShelfDescription, shelf.Items.Select(ConvertToWebObject).ToList());

  private static UserModel ConvertToWebObject(ApplicationUser user) =>
    new(user.Id, user.UserName ?? "", user.SignUpDate);

  public static ItemModel ConvertToWebObject(Item item) =>
    new(item.ItemId, item.Barcode, item.Title);

  public static Shelf ConvertToDomainObject(ShelfModel shelf) =>
    new() { UserId = shelf.User.UserId, Items = shelf.Items.Select(ConvertToDomainObject).ToList() };

  public static Item ConvertToDomainObject(ItemModel itemModel) =>
    new() { Barcode = itemModel.Barcode, Title = itemModel.Title };
}