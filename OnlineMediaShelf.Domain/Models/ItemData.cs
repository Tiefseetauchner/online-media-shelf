using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Tiefseetauchner.OnlineMediaShelf.Domain.Models;

public class ItemData : IEntity<Guid>
{
  [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
  [Key]
  public Guid Id { get; set; }

  public int Version { get; set; }

  [StringLength(64)]
  public string Barcode { get; set; } = null!;

  [StringLength(128)]
  [Required]
  public string Title { get; set; } = null!;

  public string? Description { get; set; }

  [StringLength(64)]
  public List<string> Authors { get; set; } = [];

  public DateTime? ReleaseDate { get; set; }

  [StringLength(20)]
  public string Format { get; set; } = null!;
}