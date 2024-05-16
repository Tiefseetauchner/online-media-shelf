#region

using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

#endregion

namespace Tiefseetauchner.OnlineMediaShelf.Domain.Repositories;

public interface IReadRepository<T, TKey>
{
  T? GetById(TKey id);

  Task<T?> GetByIdAsync(TKey id);

  List<T> GetAll();

  Task<List<T>> GetAllAsync();

  IQueryable<T> GetQueryable();
}