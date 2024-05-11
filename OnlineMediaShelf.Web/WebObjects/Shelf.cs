using System.Collections.Generic;

namespace Tiefseetauchner.OnlineMediaShelf.Web.WebObjects;

public record Shelf(
  int Id,
  int UserId,
  string Name,
  string Description,
  List<Item> Items);