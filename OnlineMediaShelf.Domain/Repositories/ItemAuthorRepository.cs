using System;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Tiefseetauchner.OnlineMediaShelf.Domain.Models;

namespace Tiefseetauchner.OnlineMediaShelf.Domain.Repositories;

public class ItemAuthorRepository(DbSet<ItemAuthor> dbSet) : CrudRepository<ItemAuthor, Guid>(dbSet), IItemAuthorRepository
{
  protected override IQueryable<ItemAuthor> ConfigureIncludes(DbSet<ItemAuthor> dbSet) =>
    dbSet.Include(a => a.OwnedItems);

  public ItemAuthor? GetByName(string name) =>
    AsQueryable().SingleOrDefault(_ => _.Name == name);
}