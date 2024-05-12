namespace Tiefseetauchner.OnlineMediaShelf.Domain.Repositories;

public interface IUpdateRepository<T>
{
  T Update(T entity);
}