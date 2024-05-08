using Microsoft.EntityFrameworkCore;

namespace Tiefseetauchner.OnlineMediaShelf.Domain;

public class ApplicationContext(DbContextOptions<ApplicationContext> options) : DbContext(options)
{
  public DbSet<User> Users { get; set; }
  public DbSet<Shelf> Shelves { get; set; }
}