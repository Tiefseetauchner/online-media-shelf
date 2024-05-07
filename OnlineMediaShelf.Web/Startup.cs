using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Hosting;

namespace Tiefseetauchner.OnlineMediaShelf.Web;

public class Startup
{
  public void Configure(WebApplication app)
  {
    // Configure the HTTP request pipeline.
    if (app.Environment.IsDevelopment())
    {
      app.UseOpenApi();
      app.UseSwaggerUI();
    }

    app.UseHttpsRedirection();

    app.UseAuthorization();

    app.UseStaticFiles();

    app.UseRouting();
   
    app.MapControllers();
    app.MapSwagger();
    app.MapFallbackToFile("index.html");
  }
}