#region

using System;

#endregion

namespace Tiefseetauchner.OnlineMediaShelf.Web.WebObjects;

public record UserModel(
  string UserId,
  string UserName,
  DateTime SignUpDate);