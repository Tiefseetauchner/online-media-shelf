#region

using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Tiefseetauchner.OnlineMediaShelf.Domain.Models;

#endregion

namespace Tiefseetauchner.OnlineMediaShelf.Domain.Repositories;

public class ItemRepository(DbSet<Item> dbSet) : CrudRepository<Item, int>(dbSet), IItemRepository
{
  protected override IQueryable<Item> ConfigureIncludes(DbSet<Item> dbSet) =>
    dbSet.Include(_ => _.Data).ThenInclude(_ => _.Authors);

  public Task<List<Item>> GetPaged(int pageNumber, int pageSize) =>
    AsQueryable()
      .OrderByDescending(_ => _.Id)
      .Skip(pageNumber * pageSize)
      .Take(pageSize)
      .ToListAsync();
}