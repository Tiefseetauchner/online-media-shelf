namespace DeadmanSwitchFailed.Common.Domain.Repositories;

public interface IUpdateRepository<T> : IRepositoryBase
{
  T Update(T entity);
}