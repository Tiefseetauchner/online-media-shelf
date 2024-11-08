#region

using System;
using System.Collections.Generic;

#endregion

namespace Tiefseetauchner.OnlineMediaShelf.Web.WebObjects;

public record CreateItemModel(
  string Barcode,
  string Title,
  string? Description,
  List<string> Authors,
  DateTime? ReleaseDate,
  string Format);