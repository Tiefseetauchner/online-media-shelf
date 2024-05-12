namespace Tiefseetauchner.OnlineMediaShelf.Domain.Repositories;

public interface IDeleteRepository<in T>
{
  void Delete(T entity);
}