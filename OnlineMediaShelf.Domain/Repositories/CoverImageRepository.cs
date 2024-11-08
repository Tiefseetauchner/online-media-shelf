using System;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Tiefseetauchner.OnlineMediaShelf.Domain.Models;

namespace Tiefseetauchner.OnlineMediaShelf.Domain.Repositories;

public class CoverImageRepository(DbSet<CoverImage> dbSet) : CrudRepository<CoverImage, Guid>(dbSet), ICoverImageRepository
{
  protected override IQueryable<CoverImage> ConfigureIncludes(DbSet<CoverImage> dbSet) =>
    dbSet.AsQueryable();
}