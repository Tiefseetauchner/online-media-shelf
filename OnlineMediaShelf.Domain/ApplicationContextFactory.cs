#region

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

#endregion

namespace Tiefseetauchner.OnlineMediaShelf.Domain;

public class ApplicationDbContextFactory : IDesignTimeDbContextFactory<ApplicationDbContext>
{
  public ApplicationDbContext CreateDbContext(string[] args)
  {
    var optionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();

    // Note: Only for local compiling
    var connectionString = "server=localhost;user=root;password=sql_pw;database=OMS_DB";

    var serverVersion = ServerVersion.AutoDetect(connectionString);

    optionsBuilder.UseMySql(connectionString, serverVersion);

    return new ApplicationDbContext(optionsBuilder.Options);
  }
}