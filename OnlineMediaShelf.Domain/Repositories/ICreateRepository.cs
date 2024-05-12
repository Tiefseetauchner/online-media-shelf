using System.Threading.Tasks;

namespace DeadmanSwitchFailed.Common.Domain.Repositories;

public interface ICreateRepository<T> : IRepositoryBase
{
  T Create(T entity);

  Task<T> CreateAsync(T entity);
}