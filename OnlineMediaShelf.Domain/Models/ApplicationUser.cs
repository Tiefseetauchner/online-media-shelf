#region

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

#endregion

namespace Tiefseetauchner.OnlineMediaShelf.Domain.Models;

public class ApplicationUser : IdentityUser
{
  [Required]
  public DateTime SignUpDate { get; set; } = default!;

  public List<Shelf> Shelves { get; } = [];
}