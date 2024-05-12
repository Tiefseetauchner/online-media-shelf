#region

using System.Threading.Tasks;
using Tiefseetauchner.OnlineMediaShelf.Domain.Models;
using Tiefseetauchner.OnlineMediaShelf.Domain.Repositories;

#endregion

namespace Tiefseetauchner.OnlineMediaShelf.Domain;

public interface IUserRepository :
  ICrudRepository<ApplicationUser>
{
  ApplicationUser GetByUserName(string userName);
  Task<ApplicationUser> GetByUserNameAsync(string userName);
}