#region

using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

#endregion

namespace Tiefseetauchner.OnlineMediaShelf.Domain.Models;

public class Shelf
{
  public int ShelfId { get; set; }

  public string UserId { get; set; } = null!;

  [StringLength(100)]
  public string ShelfName { get; set; } = null!;

  [StringLength(256)]
  public string ShelfDescription { get; set; } = null!;

  public ApplicationUser ApplicationUser { get; set; } = null!;

  public List<Item> Items { get; set; } = [];
}