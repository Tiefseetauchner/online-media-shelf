#region

using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.Hosting;
using Tiefseetauchner.OnlineMediaShelf.Domain.Models;

#endregion

namespace Tiefseetauchner.OnlineMediaShelf.Web;

public class Startup
{
  public void Configure(WebApplication app)
  {
    if (app.Environment.IsDevelopment())
    {
      app.UseOpenApi();
      app.UseSwaggerUI();
    }

    app.UseAuthentication();

    app.UseStaticFiles();

    app.UseCors(Program.AllowSpa);

    app.UseRouting();

    app.UseAuthorization();

    app.MapControllers();
    app.MapSwagger();
    app.MapGroup("/account").MapIdentityApi<ApplicationUser>();
    app.MapFallbackToFile("index.html");
  }
}