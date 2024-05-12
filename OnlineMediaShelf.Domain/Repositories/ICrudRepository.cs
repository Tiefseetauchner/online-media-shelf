namespace Tiefseetauchner.OnlineMediaShelf.Domain.Repositories;

public interface ICrudRepository<T, TKey> :
  ICreateRepository<T>,
  IReadRepository<T, TKey>,
  IUpdateRepository<T>,
  IDeleteRepository<T>;