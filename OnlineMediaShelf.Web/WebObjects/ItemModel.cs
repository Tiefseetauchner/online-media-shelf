#region

using System;
using System.Collections.Generic;

#endregion

namespace Tiefseetauchner.OnlineMediaShelf.Web.WebObjects;

public record ItemModel(
  int Id,
  string Barcode,
  string Title,
  string? Description,
  List<string> Authors,
  DateTime? ReleaseDate,
  string Format);