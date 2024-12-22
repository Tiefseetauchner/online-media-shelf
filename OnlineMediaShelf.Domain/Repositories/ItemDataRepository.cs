using System;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Tiefseetauchner.OnlineMediaShelf.Domain.Models;

namespace Tiefseetauchner.OnlineMediaShelf.Domain.Repositories;

public class ItemDataRepository(DbSet<ItemData> dbSet) : CrudRepository<ItemData, Guid>(dbSet), IItemDataRepository
{
  protected override IQueryable<ItemData> ConfigureIncludes(DbSet<ItemData> dbSet) =>
    dbSet.AsQueryable().Include(_ => _.Authors);
}