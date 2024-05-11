namespace Tiefseetauchner.OnlineMediaShelf.Web.WebObjects;

public record CurrentUserModel(
  bool IsLoggedIn,
  string? UserName,
  int UserId);