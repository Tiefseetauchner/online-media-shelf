using System.Collections.Generic;
using System.Threading.Tasks;

namespace Tiefseetauchner.OnlineMediaShelf.Domain.Repositories;

public interface IPaginatedRepository<T>
{
  Task<List<T>> GetPaged(int pageNumber, int pageSize);
}