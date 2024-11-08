#region

using System;
using System.Threading.Tasks;
using Tiefseetauchner.OnlineMediaShelf.Domain.Repositories;

#endregion

namespace Tiefseetauchner.OnlineMediaShelf.Domain;

public interface IUnitOfWork : IDisposable
{
  IUserRepository UserRepository { get; }
  IShelfRepository ShelfRepository { get; }
  IItemRepository ItemRepository { get; }
  IItemDataRepository ItemDataRepository { get; }
  public ICoverImageRepository CoverImageRepository { get; }

  Task CommitAsync();
}