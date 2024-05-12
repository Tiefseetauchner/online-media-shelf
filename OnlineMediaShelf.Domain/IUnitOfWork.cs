#region

using System;
using System.Threading.Tasks;
using Tiefseetauchner.OnlineMediaShelf.Domain.Models;
using Tiefseetauchner.OnlineMediaShelf.Domain.Repositories;

#endregion

namespace Tiefseetauchner.OnlineMediaShelf.Domain;

public interface IUnitOfWork : IDisposable
{
  IUserRepository UserRepository { get; }
  IShelfRepository ShelfRepository { get; }
  ICrudRepository<Item, int> ItemRepository { get; }
  Task CommitAsync();
}