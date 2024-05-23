namespace Tiefseetauchner.OnlineMediaShelf.Web.WebObjects;

public record CreateItemModel(
  string? Barcode,
  string Title,
  string? Description);