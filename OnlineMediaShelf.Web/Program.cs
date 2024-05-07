using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;

namespace Tiefseetauchner.OnlineMediaShelf.Web;

public class Program
{
  public static void Main(string[] args)
  {
    var builder = WebApplication.CreateBuilder(args);

    ConfigureServices(builder.Services);
    
    var app = builder.Build();
    
    new Startup().Configure(app);

    app.Run();
  }

  private static void ConfigureServices(IServiceCollection services)
  {
    services.AddControllers();
    
    services.AddEndpointsApiExplorer();
    services.AddOpenApiDocument();
  }
}