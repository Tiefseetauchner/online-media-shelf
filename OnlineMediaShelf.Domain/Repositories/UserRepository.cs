#region

using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Tiefseetauchner.OnlineMediaShelf.Domain.Models;

#endregion

namespace Tiefseetauchner.OnlineMediaShelf.Domain.Repositories;

public class UserRepository(DbSet<ApplicationUser> dbSet) : CrudRepository<ApplicationUser, string>(dbSet), IUserRepository
{
  private readonly DbSet<ApplicationUser> _dbSet = dbSet;

  public ApplicationUser GetByUserName(string userName) =>
    ConfigureIncludes(_dbSet)
      .Single(u => u.UserName == userName);

  public async Task<ApplicationUser> GetByUserNameAsync(string userName) =>
    await ConfigureIncludes(_dbSet)
      .SingleAsync(u => u.UserName == userName);

  protected override IQueryable<ApplicationUser> ConfigureIncludes(DbSet<ApplicationUser> dbSet) =>
    dbSet.Include(u => u.Shelves);
}