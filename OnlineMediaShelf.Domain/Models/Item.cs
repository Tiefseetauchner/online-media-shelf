#region

using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

#endregion

namespace Tiefseetauchner.OnlineMediaShelf.Domain.Models;

public class Item : IEntity<int>
{
  [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
  [Key]
  public int Id { get; set; }

  public ItemData Data { get; set; } = null!;

  public List<ItemImage> Images { get; set; } = null!;

  public List<Shelf> ContainingShelves { get; set; } = null!;
}