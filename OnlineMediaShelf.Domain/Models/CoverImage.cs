using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Tiefseetauchner.OnlineMediaShelf.Domain.Models;

public class CoverImage : IEntity<Guid>
{
  [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
  [Key]
  public Guid Id { get; }

  public byte[]? Data { get; set; }
}