#region

using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Tiefseetauchner.OnlineMediaShelf.Domain.Models;

#endregion

namespace Tiefseetauchner.OnlineMediaShelf.Domain.Repositories;

public class UserRepository(DbContext dbContext, DbSet<ApplicationUser> dbSet) : CrudRepository<ApplicationUser>(dbContext, dbSet), IUserRepository
{
  private readonly DbSet<ApplicationUser> _dbSet = dbSet;

  public ApplicationUser GetByUserName(string userName) =>
    _dbSet.AsQueryable().Single(u => u.UserName == userName);

  public async Task<ApplicationUser> GetByUserNameAsync(string userName) =>
    await _dbSet.AsQueryable().SingleAsync(u => u.UserName == userName);
}