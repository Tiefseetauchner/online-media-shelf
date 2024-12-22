using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Tiefseetauchner.OnlineMediaShelf.Domain.Models;

public class ItemAuthor : IEntity<Guid>
{
  [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
  [Key]
  public Guid Id { get; set; }
  
  [StringLength(128)]
  public string Name { get; set; } = string.Empty;
  
  public List<ItemData> OwnedItems { get; set; } = [];
}