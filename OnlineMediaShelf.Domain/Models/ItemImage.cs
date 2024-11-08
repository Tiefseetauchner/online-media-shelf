using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Tiefseetauchner.OnlineMediaShelf.Domain.Models;

public class ItemImage : IEntity<Guid>
{
  [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
  [Key]
  public Guid Id { get; set; }

  public Item OwningItem { get; set; } = null!;

  public byte[] Data { get; set; } = null!;
}