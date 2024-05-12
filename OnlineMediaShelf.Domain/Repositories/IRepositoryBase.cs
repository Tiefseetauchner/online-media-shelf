#region

using System.Threading.Tasks;

#endregion

namespace Tiefseetauchner.OnlineMediaShelf.Domain.Repositories;

public interface IRepositoryBase
{
  Task<int> SaveChanges();
}