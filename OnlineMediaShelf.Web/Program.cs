using System;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Tiefseetauchner.OnlineMediaShelf.Domain;

namespace Tiefseetauchner.OnlineMediaShelf.Web;

public class Program
{
  public static void Main(string[] args)
  {
    var builder = WebApplication.CreateBuilder(args);

    ConfigureConfiguration(builder);
    ConfigureServices(builder);

    var app = builder.Build();

    new Startup().Configure(app);

    app.Run();
  }

  private static void ConfigureConfiguration(WebApplicationBuilder builder)
  {
  }

  private static void ConfigureServices(WebApplicationBuilder builder)
  {
    var services = builder.Services;
    var connectionStrings = builder.Configuration.GetSection("connectionStrings");

    services.AddControllers();

    services.AddEndpointsApiExplorer();
    services.AddOpenApiDocument();

    var connectionString = connectionStrings["OpenMediaShelvesDb"];

    var serverVersion = ServerVersion.AutoDetect(connectionString);

    // Replace 'YourDbContext' with the name of your own DbContext derived class.
    services.AddDbContext<ApplicationContext>(
      dbContextOptions => dbContextOptions
        .UseMySql(connectionString, serverVersion)
        .LogTo(Console.WriteLine, LogLevel.Information)
        .EnableSensitiveDataLogging()
        .EnableDetailedErrors()
    );
  }
}