using System.Collections.Generic;

namespace Tiefseetauchner.OnlineMediaShelf.Web.WebObjects;

public record Shelf(
  int Id,
  int UserId,
  List<Item> Items);