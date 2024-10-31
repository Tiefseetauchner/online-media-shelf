#region

using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Tiefseetauchner.OnlineMediaShelf.Domain.Models;

#endregion

namespace Tiefseetauchner.OnlineMediaShelf.Domain.Repositories;

public class ShelfRepository(DbSet<Shelf> dbSet) : CrudRepository<Shelf, int>(dbSet), IShelfRepository
{
  private readonly DbSet<Shelf> _dbSet = dbSet;

  public List<Shelf> GetByUser(ApplicationUser user) =>
    ConfigureIncludes(_dbSet)
      .Where(shelf => shelf.User.Id == user.Id)
      .ToList();

  public async Task<List<Shelf>> GetByUserAsync(ApplicationUser user) =>
    await ConfigureIncludes(_dbSet)
      .Where(shelf => shelf.User.Id == user.Id)
      .ToListAsync();

  protected override IQueryable<Shelf> ConfigureIncludes(DbSet<Shelf> dbSet) =>
    dbSet.Include(shelf => shelf.User)
      .Include(shelf => shelf.Items)
      .ThenInclude(item => item.Data);
}