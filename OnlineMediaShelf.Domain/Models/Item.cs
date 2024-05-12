#region

using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

#endregion

namespace Tiefseetauchner.OnlineMediaShelf.Domain.Models;

public class Item
{
  [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
  [Key]
  public int Id { get; set; }

  public int Barcode { get; set; }

  [StringLength(128)]
  [Required]
  public string Title { get; set; } = null!;

  public List<Shelf> ContainingShelves { get; set; } = null!;
}