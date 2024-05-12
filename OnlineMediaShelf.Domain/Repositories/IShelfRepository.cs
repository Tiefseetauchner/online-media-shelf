#region

using System.Collections.Generic;
using System.Threading.Tasks;
using Tiefseetauchner.OnlineMediaShelf.Domain.Models;

#endregion

namespace Tiefseetauchner.OnlineMediaShelf.Domain.Repositories;

public interface IShelfRepository :
  ICrudRepository<Shelf, int>
{
  List<Shelf> GetByUser(ApplicationUser user);
  Task<List<Shelf>> GetByUserAsync(ApplicationUser user);
}