#region

using System.Collections.Generic;
using System.Threading.Tasks;

#endregion

namespace Tiefseetauchner.OnlineMediaShelf.Domain.Repositories;

public interface IReadRepository<T> : IRepositoryBase
{
  T? GetById(int id);

  Task<T?> GetByIdAsync(int id);

  List<T> GetAll();

  Task<List<T>> GetAllAsync();
}