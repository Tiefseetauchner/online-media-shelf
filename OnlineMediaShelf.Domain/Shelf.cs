namespace Tiefseetauchner.OnlineMediaShelf.Domain;

public class Shelf
{
  public int ShelfId { get; set; }
  public string Location { get; set; }
  public int UserId { get; set; }
  public User User { get; set; }
}