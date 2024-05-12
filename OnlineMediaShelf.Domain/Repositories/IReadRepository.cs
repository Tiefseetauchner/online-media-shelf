#region

using System.Threading.Tasks;

#endregion

namespace DeadmanSwitchFailed.Common.Domain.Repositories;

public interface IReadRepository<T> : IRepositoryBase
{
  T? GetById(int id);

  Task<T?> GetByIdAsync(int id);
}