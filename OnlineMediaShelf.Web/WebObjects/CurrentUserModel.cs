#region

using System;
using System.Collections.Generic;

#endregion

namespace Tiefseetauchner.OnlineMediaShelf.Web.WebObjects;

public record CurrentUserModel(
  bool IsLoggedIn,
  string? UserName,
  string UserId,
  DateTime SignUpDate,
  List<ShelfModel> Shelves);