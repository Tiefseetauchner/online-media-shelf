using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Tiefseetauchner.OnlineMediaShelf.Domain;
using Tiefseetauchner.OnlineMediaShelf.Web.WebObjects;

namespace Tiefseetauchner.OnlineMediaShelf.Web.Controllers;

[ApiController]
[Route("accountextension")]
public class AccountController(UserManager<ApplicationUser> userManager)
  : ControllerBase
{
  [HttpPost("register")]
  public async Task<IActionResult> Register([FromBody] RegisterModel model)
  {
    var user = new ApplicationUser { UserName = model.Username, Email = model.Email };
    var result = await userManager.CreateAsync(user, model.Password);

    if (result.Succeeded)
    {
      return Ok("User registered successfully");
    }

    return BadRequest(result.Errors);
  }
}