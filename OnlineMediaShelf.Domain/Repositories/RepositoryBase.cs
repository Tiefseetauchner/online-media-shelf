using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace DeadmanSwitchFailed.Common.Domain.Repositories;

public abstract class RepositoryBase<T> : IRepositoryBase, IDisposable where T : class
{
  readonly protected DbContext DbContext;
  readonly protected DbSet<T> DbSet;

  protected RepositoryBase(DbContext dbContext, DbSet<T> dbSet)
  {
    DbContext = dbContext;
    DbSet = dbSet;
  }

  public async Task<int> SaveChanges()
  {
    return await DbContext.SaveChangesAsync();
  }

  protected virtual void Dispose(bool disposing)
  {
    if (disposing)
    {
      DbContext.Dispose();
    }
  }

  public void Dispose()
  {
    Dispose(true);
    GC.SuppressFinalize(this);
  }
}