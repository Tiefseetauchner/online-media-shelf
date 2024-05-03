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
      app.UseSwagger();
      app.UseSwaggerUI();
    }

    app.UseHttpsRedirection();

    app.UseAuthorization();

    app.UseStaticFiles();

    app.MapControllers();

    app.MapFallbackToFile("index.html");
  }
}