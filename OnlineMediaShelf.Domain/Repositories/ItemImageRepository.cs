using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Tiefseetauchner.OnlineMediaShelf.Domain.Models;

namespace Tiefseetauchner.OnlineMediaShelf.Domain.Repositories;

public class ItemImageRepository(DbSet<ItemImage> dbSet) : CrudRepository<ItemImage, Guid>(dbSet), IItemImageRepository
{
  protected override IQueryable<ItemImage> ConfigureIncludes(DbSet<ItemImage> dbSet) =>
    dbSet.AsQueryable()
      .Include(_ => _.OwningItem);


  public Task<List<ItemImage>> GetByItemId(int itemId) =>
    AsQueryable().Where(_ => _.OwningItem.Id == itemId).ToListAsync();
}