#region

using System;
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

  [StringLength(64)]
  public string? Barcode { get; set; }

  [StringLength(128)]
  [Required]
  public string Title { get; set; } = null!;

  public string? Description { get; set; }

  [StringLength(64)]
  public List<string> Authors { get; set; } = [];

  public byte[]? CoverImage { get; set; }

  public DateTime ReleaseDate { get; set; }

  [StringLength(20)]
  public string Format { get; set; } = "";

  public List<Shelf> ContainingShelves { get; set; } = null!;
}