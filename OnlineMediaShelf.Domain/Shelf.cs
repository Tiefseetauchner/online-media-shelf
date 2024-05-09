using System.Collections.Generic;

namespace Tiefseetauchner.OnlineMediaShelf.Domain;

public class Shelf
{
  public int ShelfId { get; set; }
  public int UserId { get; set; }
  public User User { get; set; } = null!;
  public List<Item> Items { get; set; } = null!;
}