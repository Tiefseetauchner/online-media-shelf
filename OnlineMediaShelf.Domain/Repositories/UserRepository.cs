#region

using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Tiefseetauchner.OnlineMediaShelf.Domain.Models;

#endregion

namespace Tiefseetauchner.OnlineMediaShelf.Domain.Repositories;

public class UserRepository(DbSet<ApplicationUser> dbSet) : CrudRepository<ApplicationUser, string>(dbSet), IUserRepository
{
  public ApplicationUser GetByUserName(string userName) =>
    DbSet.AsQueryable().Single(u => u.UserName == userName);

  public async Task<ApplicationUser> GetByUserNameAsync(string userName) =>
    await DbSet.AsQueryable().SingleAsync(u => u.UserName == userName);
}