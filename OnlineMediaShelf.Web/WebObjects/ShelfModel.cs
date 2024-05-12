#region

using System.Collections.Generic;

#endregion

namespace Tiefseetauchner.OnlineMediaShelf.Web.WebObjects;

public record ShelfModel(
  int Id,
  UserModel User,
  string Name,
  string Description,
  List<ItemModel> Items);