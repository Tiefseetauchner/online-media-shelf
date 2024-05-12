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
    _dbSet.AsQueryable().Where(shelf => shelf.User.Id == user.Id).ToList();

  public Task<List<Shelf>> GetByUserAsync(ApplicationUser user) =>
    _dbSet.AsQueryable().Where(shelf => shelf.User.Id == user.Id).ToListAsync();
}