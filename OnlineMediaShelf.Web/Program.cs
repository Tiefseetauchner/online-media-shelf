using System;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Identity;
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

    services.AddCors(options =>
    {
      options.AddPolicy(name: AllowSpa,
        policy => { policy.WithOrigins("http://localhost:57687").AllowAnyHeader().AllowAnyMethod(); });
    });

    var connectionString = connectionStrings["OpenMediaShelvesDb"];

    var serverVersion = ServerVersion.AutoDetect(connectionString);

    services.AddDbContext<ApplicationContext>(
      dbContextOptions => dbContextOptions
        .UseMySql(connectionString, serverVersion)
        .LogTo(Console.WriteLine, LogLevel.Warning));

    services.AddControllers();

    services.Configure<IdentityOptions>(options =>
    {
      options.Password.RequiredUniqueChars = 4;

      options.User.AllowedUserNameCharacters =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._";
      options.User.RequireUniqueEmail = true;

      options.SignIn.RequireConfirmedPhoneNumber = false;
      options.SignIn.RequireConfirmedAccount = false;
      options.SignIn.RequireConfirmedEmail = false;
    });

    services.AddAuthentication();
    services.AddAuthorization();

    services.ConfigureApplicationCookie(options =>
    {
      options.ExpireTimeSpan = TimeSpan.FromMinutes(15);

      options.LoginPath = "/Login";
      options.LogoutPath = "/Logout";
    });

    services.AddIdentityApiEndpoints<ApplicationUser>()
      .AddEntityFrameworkStores<ApplicationContext>();

    services.AddEndpointsApiExplorer();
    services.AddOpenApiDocument();
  }

  public const string AllowSpa = "_allowSPA";
}