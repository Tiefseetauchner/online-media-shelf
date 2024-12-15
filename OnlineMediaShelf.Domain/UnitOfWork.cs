#region

using System.Threading.Tasks;
using Tiefseetauchner.OnlineMediaShelf.Domain.Repositories;

#endregion

namespace Tiefseetauchner.OnlineMediaShelf.Domain;

public class UnitOfWork(ApplicationDbContext context)
  : IUnitOfWork
{
  public IUserRepository UserRepository { get; } = new UserRepository(context.Users);
  public IShelfRepository ShelfRepository { get; } = new ShelfRepository(context.Shelves);
  public IItemRepository ItemRepository { get; } = new ItemRepository(context.Items);
  public IItemDataRepository ItemDataRepository { get; } = new ItemDataRepository(context.ItemData);
  public IItemImageRepository ItemImageRepository { get; } = new ItemImageRepository(context.ItemImages);
  public IItemAuthorRepository ItemAuthorRepository { get; } = new ItemAuthorRepository(context.ItemAuthors);

  public async Task CommitAsync()
  {
    await context.SaveChangesAsync();
  }

  public void Dispose()
  {
    context.Dispose();
  }
}