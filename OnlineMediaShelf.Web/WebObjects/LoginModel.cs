namespace Tiefseetauchner.OnlineMediaShelf.Web.WebObjects;

public record LoginModel(
  string UsernameOrEmail,
  string Password,
  bool RememberMe);