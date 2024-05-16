#region

using System.Linq;
using Microsoft.EntityFrameworkCore;
using Tiefseetauchner.OnlineMediaShelf.Domain.Models;

#endregion

namespace Tiefseetauchner.OnlineMediaShelf.Domain.Repositories;

public class ItemRepository(DbSet<Item> dbSet) : CrudRepository<Item, int>(dbSet), IItemRepository
{
  protected override IQueryable<Item> ConfigureIncludes(DbSet<Item> dbSet) =>
    dbSet.AsQueryable();
}