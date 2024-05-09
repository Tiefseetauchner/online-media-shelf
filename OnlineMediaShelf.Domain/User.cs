using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Tiefseetauchner.OnlineMediaShelf.Domain;

public class User
{
  public int UserId { get; set; }
  [StringLength(50)] public string Name { get; set; } = null!;
  [StringLength(254)] public string EMail { get; set; } = null!;
  [StringLength(128)] public string PasswordHash { get; set; } = null!;
  public List<Shelf> Shelves { get; set; } = null!;
}