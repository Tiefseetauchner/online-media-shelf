#region

using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

#endregion

namespace Tiefseetauchner.OnlineMediaShelf.Domain.Models;

public class Shelf
{
  [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
  [Key]
  public int Id { get; set; }

  [StringLength(100)]
  [Required]
  public string ShelfName { get; set; } = null!;

  [StringLength(256)]
  [Required]
  public string ShelfDescription { get; set; } = null!;

  public ApplicationUser User { get; set; } = null!;

  public List<Item> Items { get; set; } = [];
}