using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;

namespace Tiefseetauchner.OnlineMediaShelf.Domain;

public class ApplicationUser : IdentityUser
{
  public List<Shelf> Shelves { get; set; } = null!;
}