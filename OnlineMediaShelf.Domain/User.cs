using System.Collections.Generic;

namespace Tiefseetauchner.OnlineMediaShelf.Domain;

public class User
{
  public int UserId { get; set; }
  public string Name { get; set; }
  public List<Shelf> Shelves { get; set; }
}