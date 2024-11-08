#region

using System.Threading.Tasks;
using Tiefseetauchner.OnlineMediaShelf.Domain.Repositories;

#endregion

namespace Tiefseetauchner.OnlineMediaShelf.Domain;

public class UnitOfWork(ApplicationDbContext context)
  : IUnitOfWork
{
  public IUserRepository UserRepository { get; private set; } = new UserRepository(context.Users);
  public IShelfRepository ShelfRepository { get; private set; } = new ShelfRepository(context.Shelves);
  public IItemRepository ItemRepository { get; private set; } = new ItemRepository(context.Items);
  public IItemDataRepository ItemDataRepository { get; private set; } = new ItemDataRepository(context.ItemData);
  public IItemImageRepository ItemImageRepository { get; private set; } = new ItemImageRepository(context.ItemImages);

  public async Task CommitAsync()
  {
    await context.SaveChangesAsync();
  }

  public void Dispose()
  {
    context.Dispose();
  }
}