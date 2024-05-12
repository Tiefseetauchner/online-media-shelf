namespace Tiefseetauchner.OnlineMediaShelf.Domain.Repositories;

public interface ICrudRepository<T> :
  ICreateRepository<T>,
  IReadRepository<T>,
  IUpdateRepository<T>,
  IDeleteRepository<T>;