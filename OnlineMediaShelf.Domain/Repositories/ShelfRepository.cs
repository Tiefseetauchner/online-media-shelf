#region

using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Tiefseetauchner.OnlineMediaShelf.Domain.Models;

#endregion

namespace Tiefseetauchner.OnlineMediaShelf.Domain.Repositories;

public class ShelfRepository(DbContext dbContext, DbSet<Shelf> dbSet) : CrudRepository<Shelf>(dbContext, dbSet), IShelfRepository
{
  private readonly DbSet<Shelf> _dbSet = dbSet;

  public List<Shelf> GetByUser(ApplicationUser user) =>
    _dbSet.AsQueryable().Where(shelf => shelf.ApplicationUser.Id == user.Id).ToList();

  public Task<List<Shelf>> GetByUserAsync(ApplicationUser user) =>
    _dbSet.AsQueryable().Where(shelf => shelf.ApplicationUser.Id == user.Id).ToListAsync();
}