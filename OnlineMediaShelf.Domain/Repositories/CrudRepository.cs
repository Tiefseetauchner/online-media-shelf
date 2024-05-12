#region

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Tiefseetauchner.OnlineMediaShelf.Common.ArgumentChecks;

#endregion

namespace Tiefseetauchner.OnlineMediaShelf.Domain.Repositories;

public class CrudRepository<T>(DbContext dbContext, DbSet<T> dbSet)
  : RepositoryBase<T>(dbContext, dbSet),
    ICrudRepository<T>
  where T : class
{
  public T Create(T entity) =>
    DbSet.Add(entity).Entity;

  public T CreateFromAggregate<TAggregate>(TAggregate aggregate, Func<TAggregate, T> entityFactory) =>
    DbSet.Add(entityFactory.CheckNotNull()(aggregate)).Entity;

  public async Task<T> CreateAsync(T entity) =>
    (await DbSet.AddAsync(entity)).Entity;

  public T? GetById(int id) =>
    DbSet.Find(id);

  public async Task<T?> GetByIdAsync(int id) =>
    await DbSet.FindAsync(id);

  public List<T> GetAll() =>
    DbSet.ToList();

  public Task<List<T>> GetAllAsync() =>
    DbSet.ToListAsync();

  public T Update(T entity) =>
    DbSet.Update(entity).Entity;

  public void Delete(T entity) =>
    DbSet.Remove(entity);

  public async Task DeleteByIdAsync(int id)
  {
    var entity = await DbSet.FindAsync(id);
    if (entity != null)
      DbSet.Remove(entity);
  }
}