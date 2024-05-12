#region

using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

#endregion

namespace Tiefseetauchner.OnlineMediaShelf.Domain;

public class Item
{
  [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
  public int ItemId { get; set; }

  public int Barcode { get; set; }

  [StringLength(128)]
  public string Title { get; set; } = null!;

  public List<Shelf> ContainingShelves { get; set; } = null!;
}