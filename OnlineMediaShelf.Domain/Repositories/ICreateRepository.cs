#region

using System.Threading.Tasks;

#endregion

namespace Tiefseetauchner.OnlineMediaShelf.Domain.Repositories;

public interface ICreateRepository<T> : IRepositoryBase
{
  T Create(T entity);

  Task<T> CreateAsync(T entity);
}