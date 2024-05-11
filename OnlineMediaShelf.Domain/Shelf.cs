using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Tiefseetauchner.OnlineMediaShelf.Domain;

public class Shelf
{
  public int ShelfId { get; set; }

  public int UserId { get; set; }

  [StringLength(100)]
  public string ShelfName { get; set; } = null!;

  [StringLength(256)]
  public string ShelfDescription { get; set; } = null!;

  public ApplicationUser ApplicationUser { get; set; } = null!;

  public List<Item> Items { get; set; } = [];
}