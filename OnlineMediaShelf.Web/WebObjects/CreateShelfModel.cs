namespace Tiefseetauchner.OnlineMediaShelf.Web.WebObjects;

public record CreateShelfModel(
  int UserId,
  string Name,
  string Description);