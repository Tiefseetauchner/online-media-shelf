using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Tiefseetauchner.OnlineMediaShelf.Domain.Models;

namespace Tiefseetauchner.OnlineMediaShelf.Domain.Repositories;

public interface IItemImageRepository : ICrudRepository<ItemImage, Guid>
{
  Task<List<ItemImage>> GetByItemId(int itemId);
}