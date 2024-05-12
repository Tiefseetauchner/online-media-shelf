using System.Threading.Tasks;

namespace DeadmanSwitchFailed.Common.Domain.Repositories;

public interface IRepositoryBase
{
  Task<int> SaveChanges();
}