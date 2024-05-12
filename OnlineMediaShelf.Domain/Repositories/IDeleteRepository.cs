namespace DeadmanSwitchFailed.Common.Domain.Repositories;

public interface IDeleteRepository<in T> : IRepositoryBase
{
  void Delete(T entity);
}