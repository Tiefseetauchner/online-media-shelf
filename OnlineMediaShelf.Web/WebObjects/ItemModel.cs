namespace Tiefseetauchner.OnlineMediaShelf.Web.WebObjects;

public record ItemModel(
  int Id,
  string? Barcode,
  string Title,
  string? Description);