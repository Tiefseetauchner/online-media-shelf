namespace OnlineMediaShelf;

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
  }
}