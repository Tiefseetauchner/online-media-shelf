using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Tiefseetauchner.OnlineMediaShelf.Domain;
using Tiefseetauchner.OnlineMediaShelf.Domain.Models;
using Tiefseetauchner.OnlineMediaShelf.Web.WebObjects;

namespace Tiefseetauchner.OnlineMediaShelf.Web.Controllers;

[ApiController]
[Route("api/users")]
public class UserController(
  UserManager<ApplicationUser> userManager,
  IUnitOfWork unitOfWork)
  : ControllerBase
{
  [HttpGet("{id}")]
  public async Task<IActionResult> GetUserInformation(string id)
  {
    var user = await userManager.FindByIdAsync(id);

    if (user == null)
      return NotFound();

    return Ok(Mapper.ConvertToWebObject(user));
  }

  [HttpGet("find")]
  public async Task<ActionResult<UserModel[]>> FindUsers([FromQuery] string userName)
  {
    var results = (await unitOfWork.UserRepository
        .AsQueryable()
        .Where(_ => _.NormalizedUserName!.Contains(userManager.NormalizeName(userName)))
        .ToListAsync())
      .Select(Mapper.ConvertToWebObject);

    return Ok(results);
  }
}