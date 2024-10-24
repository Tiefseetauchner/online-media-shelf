using System;
using Tiefseetauchner.OnlineMediaShelf.Domain.Models;

namespace Tiefseetauchner.OnlineMediaShelf.Domain.Repositories;

public interface IItemDataRepository :
  ICrudRepository<ItemData, Guid>
{
}