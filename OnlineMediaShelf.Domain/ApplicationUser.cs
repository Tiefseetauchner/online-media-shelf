using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace Tiefseetauchner.OnlineMediaShelf.Domain;

public class ApplicationUser : IdentityUser
{
  public List<Shelf> Shelves { get; set; } = [];
}