using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Tiefseetauchner.OnlineMediaShelf.Domain;

public class Item
{
  [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
  public int ItemId { get; set; }

  public int Barcode { get; set; }

  [StringLength(128)]
  public string Title { get; set; } = null!;
}