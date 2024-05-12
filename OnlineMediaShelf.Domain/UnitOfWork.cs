using System.Collections.Concurrent;
using System.Threading.Tasks;
using DeadmanSwitchFailed.Common.Domain.Repositories;

namespace Tiefseetauchner.OnlineMediaShelf.Domain;

public class UnitOfWork : IUnitOfWork
{
  private readonly ApplicationDbContext _context;

  public UnitOfWork(ApplicationDbContext context)
  {
    _context = context;
    UserRepository = new CrudRepository<ApplicationUser>(context, context.Users);
    ShelfRepository = new CrudRepository<Shelf>(context, context.Shelves);
    ItemRepository = new CrudRepository<Item>(context, context.Items);
  }

  public CrudRepository<ApplicationUser> UserRepository { get; private set; }
  public CrudRepository<Shelf> ShelfRepository { get; private set; }
  public CrudRepository<Item> ItemRepository { get; private set; }

  public async Task CommitAsync()
  {
    await _context.SaveChangesAsync();
  }

  public void Dispose()
  {
    _context.Dispose();
  }
}