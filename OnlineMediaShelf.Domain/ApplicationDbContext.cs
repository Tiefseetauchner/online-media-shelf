#region

using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Tiefseetauchner.OnlineMediaShelf.Domain.Models;

#endregion

namespace Tiefseetauchner.OnlineMediaShelf.Domain;

public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : IdentityDbContext<ApplicationUser>(options)
{
  public DbSet<Shelf> Shelves { get; set; } = null!;
  public DbSet<Item> Items { get; set; } = null!;
  public DbSet<ItemData> ItemData { get; set; } = null!;
  public DbSet<ItemImage> ItemImages { get; set; } = null!;
  public DbSet<ItemAuthor> ItemAuthors { get; set; } = null!;

  protected override void OnModelCreating(ModelBuilder builder)
  {
    base.OnModelCreating(builder);

    builder.Entity<Shelf>().HasMany(s => s.Items).WithMany(i => i.ContainingShelves);
    builder.Entity<ItemData>().HasMany(d => d.Authors).WithMany(a => a.OwnedItems);
  }
}