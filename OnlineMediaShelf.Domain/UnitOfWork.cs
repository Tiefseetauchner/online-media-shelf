#region

using System.Threading.Tasks;
using Tiefseetauchner.OnlineMediaShelf.Domain.Models;
using Tiefseetauchner.OnlineMediaShelf.Domain.Repositories;

#endregion

namespace Tiefseetauchner.OnlineMediaShelf.Domain;

public class UnitOfWork(ApplicationDbContext context)
  : IUnitOfWork
{
  public IUserRepository UserRepository { get; private set; } = new UserRepository(context.Users);
  public IShelfRepository ShelfRepository { get; private set; } = new ShelfRepository(context.Shelves);
  public ICrudRepository<Item, int> ItemRepository { get; private set; } = new CrudRepository<Item, int>(context.Items);

  public async Task CommitAsync()
  {
    await context.SaveChangesAsync();
  }

  public void Dispose()
  {
    context.Dispose();
  }
}