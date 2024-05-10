using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace Tiefseetauchner.OnlineMediaShelf.Domain;

public class ApplicationContextFactory : IDesignTimeDbContextFactory<ApplicationContext>
{
  public ApplicationContext CreateDbContext(string[] args)
  {
    var optionsBuilder = new DbContextOptionsBuilder<ApplicationContext>();

    // Note: Only for local compiling
    var connectionString = "server=localhost;user=root;password=sql_pw;database=OMS_DB";

    var serverVersion = ServerVersion.AutoDetect(connectionString);

    optionsBuilder.UseMySql(connectionString, serverVersion);

    return new ApplicationContext(optionsBuilder.Options);
  }
}