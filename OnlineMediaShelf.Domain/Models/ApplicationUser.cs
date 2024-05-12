#region

using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

#endregion

namespace Tiefseetauchner.OnlineMediaShelf.Domain.Models;

public class ApplicationUser : IdentityUser
{
  public DateTime SignUpDate { get; set; } = default!;

  public List<Shelf> Shelves { get; set; } = [];
}