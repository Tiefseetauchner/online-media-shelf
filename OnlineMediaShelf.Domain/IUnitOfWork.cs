#region

using System;
using System.Threading.Tasks;
using DeadmanSwitchFailed.Common.Domain.Repositories;

#endregion

namespace Tiefseetauchner.OnlineMediaShelf.Domain;

public interface IUnitOfWork : IDisposable
{
  CrudRepository<ApplicationUser> UserRepository { get; }
  CrudRepository<Shelf> ShelfRepository { get; }
  CrudRepository<Item> ItemRepository { get; }
  Task CommitAsync();
}