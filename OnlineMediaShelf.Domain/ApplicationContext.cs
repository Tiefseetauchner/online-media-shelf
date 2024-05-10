using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Tiefseetauchner.OnlineMediaShelf.Domain;

public class ApplicationContext(DbContextOptions<ApplicationContext> options) : IdentityDbContext<ApplicationUser>(options)
{
  public DbSet<Shelf> Shelves { get; set; }
  public DbSet<Item> Items { get; set; }
}